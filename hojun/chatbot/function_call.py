import json
from flask import jsonify
from hojun.chatbot.function import search_similar_data
from hojun.chatbot.llm_setup import client

client = client

# 챗봇이 사용 가능한 함수들
functions = [
    {
        "name": "search_similar_data",
        "description": (
            "사용자 요구사항 기반 유사 데이터 검색. "
            "data_type, purpose, details를 모두 포함해야 한다. "
            "이 함수는 벡터 DB에서 검색한 결과를 JSON 형태로 반환한다."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "data_type": {
                    "type": "string",
                    "description": "사용자가 원하는 데이터 유형 (예: '게임 데이터', '금융 데이터')"
                },
                "purpose": {
                    "type": "string",
                    "description": "사용자가 해당 데이터를 사용하려는 목적"
                },
                "details": {
                    "type": "string",
                    "description": "사용자가 원하는 추가 조건, 세부사항"
                }
            },
            "required": ["data_type", "purpose", "details"]
        }
    }
]

conversation_history = []

def handle_user_message(user_message):
    # 초기 대화 설정
    if not conversation_history:
        conversation_history.append({
            "role": "system",
            "content": (
                "당신은 데이터셋 추천을 돕는 고급 AI 어시스턴트입니다. "
                "사용자가 원하는 data_type, purpose, details를 파악한 뒤 "
                "'search_similar_data' 함수를 호출하여 벡터 DB 결과를 얻으세요. "
                "함수 호출 전에는 충분한 정보가 없으면 추가 질문을 하세요. "
                "함수 결과가 나오면, 그 결과(JSON)만 사용하여 답변하세요. "
                "외부 지식 사용 금지. 결과에 없는 정보 추론 금지. "
                "결과가 만족스럽지 않다면 '적합한 데이터가 없습니다.'라고 답하세요. "
                "가능한 한 풍부하고 상세하게, 데이터셋 형식, 메타데이터, 활용방안 등을 설명하세요."
            )
        })

    # 사용자 메시지 추가
    conversation_history.append({"role": "user", "content": user_message})

    # 1차 LLM 응답
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation_history,
        functions=functions,
        function_call="auto",
    )

    assistant_message = response.choices[0].message

    # 함수 호출 여부 판단
    if assistant_message.function_call is not None:
        func_name = assistant_message.function_call.name
        args_str = assistant_message.function_call.arguments or "{}"

        try:
            # JSON 파싱 시도
            arguments = json.loads(args_str)
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e} | Arguments: {args_str}")
            return jsonify({"reply": "입력된 함수 인자가 올바르지 않습니다. 관리자에게 문의하세요."}), 400

       # data_type 값 검증 및 추가 질문
        if not arguments.get("data_type"):
            conversation_history.append({
                "role": "system",
                "content": (
                    "데이터 유형(data_type)을 입력하지 않으셨습니다. 원하는 데이터의 유형을 입력해 주세요. "
                    "예를 들어, 특정 분야(예: 금융 데이터, 스포츠 데이터, 교육 데이터)나 형식을 포함할 수 있습니다."
                )
            })
            return jsonify({"reply": "데이터 유형(data_type)을 입력해 주세요. 예: 금융 데이터, 스포츠 데이터 등."}), 400

        # purpose 값 검증 및 추가 질문
        if not arguments.get("purpose"):
            conversation_history.append({
                "role": "system",
                "content": (
                    "데이터의 사용 목적(purpose)을 입력하지 않으셨습니다. 데이터를 어떻게 활용할 계획인지 알려주세요. "
                    "예를 들어, 분석, 시각화, 기계 학습 모델 훈련 등의 목적을 포함할 수 있습니다."
                )
            })
            return jsonify({"reply": "데이터의 사용 목적(purpose)을 입력해 주세요. 예: 분석, 시각화, 기계 학습 모델 훈련 등."}), 400

        # details 값 검증 및 추가 질문
        if not arguments.get("details"):
            conversation_history.append({
                "role": "system",
                "content": (
                    "데이터에 대한 세부사항(details)을 입력하지 않으셨습니다. 필요한 추가 정보를 알려주세요. "
                    "예를 들어, 데이터의 기간, 형식, 특정 조건 등이 포함될 수 있습니다."
                )
            })
            return jsonify({"reply": "데이터에 대한 세부사항(details)을 입력해 주세요. 예: 데이터의 기간, 형식, 특정 조건 등."}), 400


        # 함수 실행
        try:
            search_results = search_similar_data({
                "data_type": arguments["data_type"],
                "purpose": arguments["purpose"],
                "details": arguments["details"]
            })

            # 함수 결과 추가
            conversation_history.append({
                "role": "function",
                "name": func_name,
                "content": json.dumps(search_results)
            })

            # 함수 결과에 기반해 답변하도록 system 메시지 추가
            conversation_history.append({
                "role": "system",
                "content": (
                    "위 function 메시지에서 JSON으로 된 검색 결과를 받았습니다. "
                    "이 JSON 데이터에 담긴 데이터셋 정보만 활용하여 사용자가 원하는 목적에 적합한 데이터셋을 최대한 상세히 설명하십시오. "
                    "형식, 파일 크기, 포함된 메타데이터 필드, 어떤 분석이나 활용에 유용한지 등을 구체적으로 안내하세요. "
                    "JSON 결과에 데이터셋이 없거나 만족스럽지 않다면 '적합한 데이터가 없습니다.'라고 답하세요. "
                    "외부 지식이나 추론 금지. 오직 JSON 결과 기반."
                )
            })

            # 최종 답변 생성
            final_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=conversation_history
            )
            final_assistant_msg = final_response.choices[0].message.content
            return jsonify({"reply": final_assistant_msg})

        except Exception as e:
            print(f"Error in search_similar_data: {e}")
            return jsonify({"reply": "데이터 검색 중 오류가 발생했습니다. 관리자에게 문의하세요."}), 500

    else:
        # 함수 호출 없이 바로 답변할 경우
        final_reply = assistant_message.content
        return jsonify({"reply": final_reply})
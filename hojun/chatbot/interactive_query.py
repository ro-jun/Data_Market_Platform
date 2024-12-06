from openai import OpenAI
import os
import json
from flask import jsonify
from hojun.chatbot.similar_search import search_similar_data

client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY'],  
)

conversation_history = []

functions = [
    {
        "name": "search_similar_data",
        "description": "사용자 요구사항 기반 유사 데이터 검색. 적절한 data_type, purpose, details를 모두 포함해야 한다.",
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

def handle_user_message(user_message):
    # 초기 대화 설정: 대화가 시작될 때(즉, conversation_history가 비어있을 때) system 메시지 추가
    if not conversation_history:
        conversation_history.append({
            "role": "system", 
            "content": (
                "당신은 데이터셋 추천을 돕는 고급 AI 어시스턴트입니다. "
                "사용자가 원하는 데이터 타입, 목적, 세부사항을 충분히 이해한 뒤, "
                "필요시 'search_similar_data' 함수를 호출하세요. "
                "만약 사용자가 아직 명확하지 않다면 추가 질문을 통해 정보를 수집하십시오. "
                "필요한 정보가 충분해지면 함수 호출을 통해 데이터셋을 추천하고, 결과를 바탕으로 최종 답변을 제공하세요."
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

    if assistant_message.function_call is not None:
        func_name = assistant_message.function_call.name
        args_str = assistant_message.function_call.arguments or "{}"

        try:
            arguments = json.loads(args_str)
        except json.JSONDecodeError:
            # 함수 인자 파싱 실패시 모델에게 수정 요청
            conversation_history.append({
                "role": "system",
                "content": "함수 인자가 올바르지 않습니다. data_type, purpose, details를 올바른 문자열로 전달해주세요."
            })
            retry_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=conversation_history,
                functions=functions,
                function_call="auto"
            )
            assistant_message = retry_response.choices[0].message
            arguments = json.loads(assistant_message.function_call.arguments)

        # 인자 유효성 체크
        if not arguments.get("data_type") or not arguments.get("purpose") or not arguments.get("details"):
            conversation_history.append({
                "role": "system",
                "content": "함수 호출 인자가 불충분합니다. data_type, purpose, details를 모두 제공해주세요."
            })
            # 다시 재요청
            retry_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=conversation_history,
                functions=functions,
                function_call="auto"
            )
            assistant_message = retry_response.choices[0].message
            arguments = json.loads(assistant_message.function_call.arguments)

        # 실제 함수 호출
        search_results = search_similar_data({
            "data_type": arguments["data_type"],
            "purpose": arguments["purpose"],
            "details": arguments["details"]
        })

        # 함수 결과 전달 (이미 search_results는 직렬화 가능한 형태로 반환)
        conversation_history.append({
            "role": "function",
            "name": func_name,
            "content": json.dumps(search_results)
        })

        # 최종 응답 요청
        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=conversation_history
        )
        final_assistant_msg = final_response.choices[0].message.content
        return jsonify({"reply": final_assistant_msg})

    else:
        # 함수 호출 없이 바로 답변
        final_reply = assistant_message.content
        return jsonify({"reply": final_reply})
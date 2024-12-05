document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            contents.forEach((content) => content.classList.add('hidden'));
            const targetId = button.id.replace('-tab', '-content');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    document.getElementById('profile-tab').click();
});
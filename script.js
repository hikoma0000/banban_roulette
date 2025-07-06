document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const gunImage = document.getElementById('gun-image');
    const resultOverlay = document.getElementById('result-overlay');

    const liveRoundsInput = document.getElementById('live-rounds');
    const blankRoundsInput = document.getElementById('blank-rounds');

    const bangSound = document.getElementById('bang-sound');
    const clickSound = document.getElementById('click-sound');

    let chamber = [];
    let isGameOver = false;

    // スタートボタンのクリックイベント
    startButton.addEventListener('click', () => {
        const liveRounds = parseInt(liveRoundsInput.value, 10);
        const blankRounds = parseInt(blankRoundsInput.value, 10);

        if (isNaN(liveRounds) || isNaN(blankRounds) || (liveRounds + blankRounds <= 0)) {
            alert('弾を1つ以上設定してください。');
            return;
        }

        // チャンバー（弾倉）を作成
        chamber = [];
        for (let i = 0; i < liveRounds; i++) chamber.push('live');
        for (let i = 0; i < blankRounds; i++) chamber.push('blank');

        // チャンバーをシャッフル (Fisher-Yatesアルゴリズム)
        for (let i = chamber.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chamber[i], chamber[j]] = [chamber[j], chamber[i]];
        }
        
        // ゲーム画面へ切り替え
        isGameOver = false;
        resultOverlay.style.opacity = 0;
        setupScreen.classList.remove('active');
        gameScreen.classList.add('active');
    });

    // 銃画像のクリックイベント（発射）
    gunImage.addEventListener('click', () => {
        if (isGameOver || chamber.length === 0) {
            return;
        }

        const round = chamber.shift(); // 配列の先頭から弾を取り出す

        if (round === 'live') {
            // 実弾の場合
            bangSound.currentTime = 0;
            bangSound.play();
            document.body.style.backgroundColor = '#800000'; // 背景を赤くする
            showResult('BANG!!');
            isGameOver = true;
            setTimeout(resetGame, 2500); // 2.5秒後にリセット
        } else {
            // 空砲の場合
            clickSound.currentTime = 0;
            clickSound.play();
            
            if (chamber.length === 0) {
                // 全て空砲だった場合
                showResult('SAFE...');
                isGameOver = true;
                setTimeout(resetGame, 2500); // 2.5秒後にリセット
            }
        }
    });

    // 結果を表示する関数
    function showResult(message) {
        resultOverlay.textContent = message;
        resultOverlay.style.opacity = 1;
    }

    // ゲームをリセットする関数
    function resetGame() {
        document.body.style.backgroundColor = '#1a1a1a'; // 背景色を戻す
        gameScreen.classList.remove('active');
        setupScreen.classList.add('active');
    }
});
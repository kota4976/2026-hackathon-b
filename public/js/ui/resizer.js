export function initResizer() {
    const container = document.getElementById('pane-container');
    const resizer1 = document.getElementById('resizer-1');
    const resizer2 = document.getElementById('resizer-2');

    if (!container || !resizer1 || !resizer2) return;

    let isResizing1 = false;
    let isResizing2 = false;
    
    // 現在の幅を保持（CSSの初期値と合わせる）
    let col1Width = 200;
    let col2Width = 300;

    resizer1.addEventListener('mousedown', (e) => {
        isResizing1 = true;
        resizer1.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        e.preventDefault(); // テキスト選択を防ぐ
    });

    resizer2.addEventListener('mousedown', (e) => {
        isResizing2 = true;
        resizer2.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing1 && !isResizing2) return;

        // Containerの左端からの位置を取得
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;

        if (isResizing1) {
            // カテゴリペインの幅を更新
            let newWidth = x;
            if (newWidth < 120) newWidth = 120; // 最小幅
            if (newWidth > 400) newWidth = 400; // 最大幅
            col1Width = newWidth;
        } else if (isResizing2) {
            // スレッド一覧ペインの幅を更新 (x位置 - col1幅 - resizer1の幅4px)
            let newWidth = x - col1Width - 4;
            if (newWidth < 200) newWidth = 200; // 最小幅
            if (newWidth > 600) newWidth = 600; // 最大幅
            col2Width = newWidth;
        }

        // JSで直接CSS Gridの幅を更新
        container.style.gridTemplateColumns = `${col1Width}px 4px ${col2Width}px 4px 1fr`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing1 || isResizing2) {
            isResizing1 = false;
            isResizing2 = false;
            resizer1.classList.remove('dragging');
            resizer2.classList.remove('dragging');
            document.body.style.cursor = ''; // デフォルトに戻す
        }
    });
}

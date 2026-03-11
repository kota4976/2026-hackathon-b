// public/js/ui/effects.js

/**
 * 対象のDOM要素を「下からじわじわと燃やす」GSAPアニメーション
 * @param {HTMLElement} containerElement 燃やす対象（thread-detail-containerなど）
 * @param {Function} onComplete アニメーション完了後のコールバック
 */
export const playBurnAnimation = (containerElement, onComplete) => {
    const parentPane = containerElement.parentElement;
    if (parentPane) {
        parentPane.style.position = 'relative';
        parentPane.style.overflow = 'hidden'; 
    }

    const rect = containerElement.getBoundingClientRect();
    containerElement.style.transformOrigin = "bottom center";

    const fireContainer = document.createElement('div');
    fireContainer.className = 'fire-container';
    
    const gooeyLayer = document.createElement('div');
    gooeyLayer.className = 'fire-gooey-layer';
    gooeyLayer.style.background = '#000';
    gooeyLayer.style.mixBlendMode = 'screen';
    
    fireContainer.appendChild(gooeyLayer);

    if (parentPane) {
        parentPane.appendChild(fireContainer);
    } else {
        document.body.appendChild(fireContainer);
    }

    const burnEdge = document.createElement('div');
    burnEdge.className = 'burn-edge';
    burnEdge.style.bottom = '0px';
    fireContainer.appendChild(burnEdge);

    const numBlobs = 60;
    const blobs = [];
    
    for (let i = 0; i < numBlobs; i++) {
        const p = document.createElement('div');
        p.className = 'fire-blob';
        
        const size = Math.random() * 40 + 20; 
        const hue = Math.random() * 30 - 10; 
        
        Object.assign(p.style, {
            left: `${Math.random() * 100}%`,
            bottom: '0px',
            width: `${size}px`,
            height: `${size}px`,
            filter: `hue-rotate(${hue}deg)`,
            opacity: 0
        });
        
        gooeyLayer.appendChild(p);
        blobs.push(p);
    }

    gsap.set(containerElement, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(containerElement, { clipPath: 'inset(0% 0% 0% 0%)' });

    const tl = gsap.timeline({
        onComplete: () => {
            if (fireContainer.parentElement) {
                fireContainer.parentElement.removeChild(fireContainer);
            }
            if (parentPane) {
                parentPane.style.overflow = '';
            }
            if (onComplete) onComplete();
        }
    });

    tl.to(containerElement, {
        rotation: (Math.random() - 0.5) * 1,
        duration: 0.5,
        ease: 'power1.inOut'
    }, 0);

    tl.to(blobs, {
        opacity: () => Math.random() * 0.8 + 0.2,
        y: () => -(Math.random() * 50 + 20),
        duration: 0.5,
        stagger: { amount: 0.5, from: "random" }
    }, 0);

    const burnDuration = 2.5;

    const charGradient = document.createElement('div');
    Object.assign(charGradient.style, {
        position: 'absolute',
        bottom: '0px',
        left: '-5%',
        width: '110%',
        height: '150px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(40,10,0,0.8) 30%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: -1
    });
    fireContainer.appendChild(charGradient);

    tl.to(containerElement, {
        clipPath: 'inset(0% 0% 100% 0%)', 
        scaleX: 0.98,
        scaleY: 0.98,
        duration: burnDuration,
        ease: 'none'
    }, 0.5);

    tl.to([burnEdge, charGradient], {
        bottom: '100%',
        duration: burnDuration,
        ease: 'none'
    }, 0.5);

    tl.to(blobs, {
        y: () => -(rect.height + Math.random() * 100),
        x: () => (Math.random() - 0.5) * 100,
        scale: 0.2,
        duration: () => burnDuration + Math.random() * 0.5, 
        ease: 'none',
        stagger: {
            amount: 1.0,
            from: "random"
        }
    }, 0.5);

    tl.to([burnEdge, gooeyLayer, charGradient], {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.out'
    }, 0.5 + burnDuration + 0.2);
};

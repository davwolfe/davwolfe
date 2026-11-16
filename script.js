// Email link: the address is put together here so it never sits in the page source as plain text.
document.querySelectorAll('.js-email').forEach(function (link) {
    link.href = 'mailto:' + link.dataset.user + '@' + link.dataset.domain;
});

// Project carousel: arrows, dots, and swipe/scroll support for every .carousel on the page
document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var cards = track.querySelectorAll('.project-card');
    var prev = carousel.querySelector('.prev');
    var next = carousel.querySelector('.next');
    var dotsBox = carousel.nextElementSibling;
    var dots = [];

    if (cards.length <= 1) {
        carousel.classList.add('single');
        prev.disabled = true;
        next.disabled = true;
        return;
    }

    cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsBox.appendChild(dot);
        dots.push(dot);
    });

    function currentIndex() {
        return Math.round(track.scrollLeft / (cards[1].offsetLeft - cards[0].offsetLeft));
    }

    function goTo(i) {
        i = Math.max(0, Math.min(cards.length - 1, i));
        track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft });
    }

    function update() {
        var i = currentIndex();
        dots.forEach(function (d, j) { d.classList.toggle('active', j === i); });
        prev.disabled = i === 0;
        next.disabled = i === cards.length - 1;
    }

    // Drag with the mouse to slide (touch screens and trackpads already scroll on their own)
    var dragStartX = null;
    var dragStartScroll = 0;

    track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragStartX = e.clientX;
        dragStartScroll = track.scrollLeft;
    });

    window.addEventListener('pointermove', function (e) {
        if (dragStartX === null) return;
        var moved = e.clientX - dragStartX;
        if (Math.abs(moved) > 5) track.classList.add('dragging');
        if (track.classList.contains('dragging')) track.scrollLeft = dragStartScroll - moved;
    });

    window.addEventListener('pointerup', function (e) {
        if (dragStartX === null) return;
        var moved = e.clientX - dragStartX;
        var wasDragging = track.classList.contains('dragging');
        var startIndex = Math.round(dragStartScroll / (cards[1].offsetLeft - cards[0].offsetLeft));
        dragStartX = null;
        track.classList.remove('dragging');
        if (wasDragging) {
            // a drag of more than 60px moves one card; anything smaller settles back
            goTo(startIndex + (moved < -60 ? 1 : moved > 60 ? -1 : 0));
        }
    });

    // Left and right arrow keys when the slider has keyboard focus
    track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex() + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex() - 1); }
    });

    prev.addEventListener('click', function () { goTo(currentIndex() - 1); });
    next.addEventListener('click', function () { goTo(currentIndex() + 1); });
    track.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
});

btnReadMore = document.getElementById('btnReadMore');

btnReadMore.addEventListener('click', (e) => {
  if (btnReadMore.innerText === 'Read More') {
    btnReadMore.innerText = 'Read Less'
  } else {
    btnReadMore.innerText = 'Read More'
  }
})
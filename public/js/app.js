document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  document.addEventListener('click', function(e) {
    if (nav && nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
    }
  });
});

function incrementQty() {
  const input = document.getElementById('quantity');
  if (input) {
    const val = parseInt(input.value) || 1;
    if (val < 99) input.value = val + 1;
  }
}

function decrementQty() {
  const input = document.getElementById('quantity');
  if (input) {
    const val = parseInt(input.value) || 1;
    if (val > 1) input.value = val - 1;
  }
}

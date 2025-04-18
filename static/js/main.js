// Tab switching functionality
function openTab(tabName, element, color) {
  // Hide all tab content
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  // Remove active class from all tablinks
  var tablinks = document.getElementsByClassName("tablink");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the specific tab content
  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  
  // Add active class to the button that opened the tab
  element.classList.add("active");
}

// Set default open tab
document.addEventListener("DOMContentLoaded", function() {
  // Get the element with id="defaultOpen" and click on it
  if (document.getElementById("defaultOpen")) {
    document.getElementById("defaultOpen").click();
  }
  
  // Add animation to form elements
  animateFormElements();
});

// Animate form elements on load
function animateFormElements() {
  const formElements = document.querySelectorAll('.form-control, .btn');
  
  formElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

// Form validation
function validateSymptomForm() {
  let valid = false;
  
  // Check if at least one symptom is selected
  const symptomInputs = document.querySelectorAll('input[name^="Symptom"]');
  for (let input of symptomInputs) {
    if (input.value.trim() !== "") {
      valid = true;
      break;
    }
  }
  
  if (!valid) {
    alert("Please enter at least one symptom.");
    return false;
  }
  
  return true;
}

// Initialize doctor search map
function initializeMap() {
  if (typeof google !== 'undefined' && document.getElementById('gmap_canvas')) {
    // Map initialization code will run from the existing script in find_doctor.html
    console.log("Map initialized");
  }
} 
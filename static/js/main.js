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
  
  // Initialize symptom sliders
  initSymptomControls();
  
  // Set active state for navigation links
  setActiveNavLink();
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

// Set active navigation link based on current URL
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

// Initialize symptom controls
function initSymptomControls() {
  // Show/hide severity and duration based on symptom input
  for (let i = 1; i <= 5; i++) {
    const symptomInput = document.getElementById(`symptom${i}Input`);
    if (!symptomInput) continue;
    
    const severityContainer = document.getElementById(`severity${i}Container`);
    const durationContainer = document.getElementById(`duration${i}Container`);
    
    // Initial check
    if (symptomInput.value.trim() !== '') {
      severityContainer.style.display = 'block';
      durationContainer.style.display = 'block';
    }
    
    // Add event listener
    symptomInput.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        severityContainer.style.display = 'block';
        durationContainer.style.display = 'block';
      } else {
        severityContainer.style.display = 'none';
        durationContainer.style.display = 'none';
      }
    });
  }
}

// Update severity value display
function updateSeverityValue(id, value) {
  document.getElementById(`${id}Value`).textContent = value;
}

// Update radius value display
function updateRadiusValue(value) {
  document.getElementById('radiusValue').textContent = value;
}

// Handle filter option clicks
function toggleFilterOption(element) {
  element.classList.toggle('active');
}

// Helper function to get distance between two points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Responsive behavior for mobile devices
function handleResponsiveLayout() {
  const width = window.innerWidth;
  
  // Adjust map height on mobile
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    if (width < 576) {
      mapContainer.style.height = '300px';
    } else if (width < 992) {
      mapContainer.style.height = '400px';
    } else {
      mapContainer.style.height = '500px';
    }
  }
}

// Call responsive handler on resize
window.addEventListener('resize', handleResponsiveLayout);
// Call once on page load
document.addEventListener('DOMContentLoaded', handleResponsiveLayout); 
// This script needs to be included in form.html
document.addEventListener('DOMContentLoaded', function() {
    // Add the dynamic form functions
    function addAchievement() {
      const container = document.getElementById('achievementsContainer');
      const newItem = container.querySelector('.achievement-item').cloneNode(true);
      newItem.querySelectorAll('input').forEach(input => input.value = '');
      container.appendChild(newItem);
    }
    
    function addExperience() {
      const container = document.getElementById('experienceContainer');
      const newItem = container.querySelector('.experience-item').cloneNode(true);
      newItem.querySelectorAll('input').forEach(input => input.value = '');
      container.appendChild(newItem);
    }
    
    function addEducation() {
      const container = document.getElementById('educationContainer');
      const newItem = container.querySelector('.education-item').cloneNode(true);
      newItem.querySelectorAll('input').forEach(input => input.value = '');
      container.appendChild(newItem);
    }
    
    function addProject() {
      const container = document.getElementById('projectsContainer');
      const newItem = container.querySelector('.project-item').cloneNode(true);
      newItem.querySelectorAll('input').forEach(input => input.value = '');
      container.appendChild(newItem);
    }
    
    function addSkill() {
      const container = document.getElementById('skillsContainer');
      const newItem = container.querySelector('.skill-item').cloneNode(true);
      newItem.querySelectorAll('input').forEach(input => input.value = '');
      container.appendChild(newItem);
    }
    
    function removeItem(button) {
      const parentContainer = button.closest('[id$="Container"]');
      const items = parentContainer.querySelectorAll('[class$="-item"]');
      
      if (items.length > 1) {
        button.closest('[class$="-item"]').remove();
      }
    }
    
    // Expose these functions to the global scope for the HTML buttons
    window.addAchievement = addAchievement;
    window.addExperience = addExperience;
    window.addEducation = addEducation;
    window.addProject = addProject;
    window.addSkill = addSkill;
    window.removeItem = removeItem;
    
    const resumeForm = document.getElementById('resumeForm');
    
    if (resumeForm) {
      resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = {
          firstname: document.getElementById('firstname').value,
          lastname: document.getElementById('lastname').value,
          designation: document.getElementById('designation').value,
          address: document.getElementById('address').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          summary: document.getElementById('summary').value
        };
        
        // Handle profile image - Convert to base64 for storage in sessionStorage
        const profileImageInput = document.getElementById('profileImage');
        if (profileImageInput && profileImageInput.files && profileImageInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function(e) {
            formData.profileImageData = e.target.result; // Store as base64 string
            
            // Continue with form data collection and submission
            collectRemainingFormData(formData);
          };
          reader.readAsDataURL(profileImageInput.files[0]);
        } else {
          // No image selected, continue with the rest of the form
          collectRemainingFormData(formData);
        }
      });
    }
    
    function collectRemainingFormData(formData) {
      // Collect achievement data
      formData.achieve_title = [];
      formData.achieve_description = [];
      const achievementItems = document.querySelectorAll('.achievement-item');
      achievementItems.forEach(item => {
        const titleInput = item.querySelector('input[name="achieve_title"]');
        const descInput = item.querySelector('input[name="achieve_description"]');
        if (titleInput && titleInput.value) {
          formData.achieve_title.push(titleInput.value);
          formData.achieve_description.push(descInput ? descInput.value : '');
        }
      });
      
      // Collect experience data
      formData.exp_title = [];
      formData.exp_organization = [];
      formData.exp_location = [];
      formData.exp_start_date = [];
      formData.exp_end_date = [];
      formData.exp_description = [];
      const experienceItems = document.querySelectorAll('.experience-item');
      experienceItems.forEach(item => {
        const titleInput = item.querySelector('input[name="exp_title[]"]');
        if (titleInput && titleInput.value) {
          formData.exp_title.push(titleInput.value);
          formData.exp_organization.push(item.querySelector('input[name="exp_organization[]"]').value || '');
          formData.exp_location.push(item.querySelector('input[name="exp_location[]"]').value || '');
          formData.exp_start_date.push(item.querySelector('input[name="exp_start_date[]"]').value || '');
          formData.exp_end_date.push(item.querySelector('input[name="exp_end_date[]"]').value || '');
          formData.exp_description.push(item.querySelector('input[name="exp_description[]"]').value || '');
        }
      });
      
      // Collect education data
      formData.edu_school = [];
      formData.edu_degree = [];
      formData.edu_city = [];
      formData.edu_start_date = [];
      formData.edu_graduation_date = [];
      formData.edu_description = [];
      const educationItems = document.querySelectorAll('.education-item');
      educationItems.forEach(item => {
        const degreeInput = item.querySelector('input[name="edu_degree[]"]');
        if (degreeInput && degreeInput.value) {
          formData.edu_degree.push(degreeInput.value);
          formData.edu_school.push(item.querySelector('input[name="edu_school[]"]').value || '');
          formData.edu_city.push(item.querySelector('input[name="edu_city[]"]').value || '');
          formData.edu_start_date.push(item.querySelector('input[name="edu_start_date[]"]').value || '');
          formData.edu_graduation_date.push(item.querySelector('input[name="edu_graduation_date[]"]').value || '');
          formData.edu_description.push(item.querySelector('input[name="edu_description[]"]').value || '');
        }
      });
      
      // Collect project data
      formData.proj_title = [];
      formData.proj_link = [];
      formData.proj_description = [];
      const projectItems = document.querySelectorAll('.project-item');
      projectItems.forEach(item => {
        const titleInput = item.querySelector('input[name="proj_title[]"]');
        if (titleInput && titleInput.value) {
          formData.proj_title.push(titleInput.value);
          formData.proj_link.push(item.querySelector('input[name="proj_link[]"]').value || '');
          formData.proj_description.push(item.querySelector('input[name="proj_description[]"]').value || '');
        }
      });
      
      // Collect skill data
      formData.skill = [];
      const skillItems = document.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        const skillInput = item.querySelector('input[name="skill[]"]');
        if (skillInput && skillInput.value) {
          formData.skill.push(skillInput.value);
        }
      });
      
      // Save form data and redirect
      sessionStorage.setItem('resumeFormData', JSON.stringify(formData));
      window.location.href = 'resume.html';
    }
  });
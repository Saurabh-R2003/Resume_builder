// Script for resume.html with fixed functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get form data from sessionStorage (saved when form was submitted)
    function getFormData() {
      const formData = sessionStorage.getItem('resumeFormData');
      if (!formData) {
        console.warn('No form data found in session storage');
        return null;
      }
      return JSON.parse(formData);
    }
    
    // Handle profile image loading
    function handleProfileImage(imageFile) {
      const profileImage = document.getElementById('profileImage');
      const placeholder = document.getElementById('profileImagePlaceholder');
      
      if (imageFile && typeof imageFile === 'object') {
        // Handle File object directly from form submission
        const reader = new FileReader();
        reader.onload = function(e) {
          profileImage.src = e.target.result;
          profileImage.style.display = 'block';
          placeholder.style.display = 'none';
        };
        reader.readAsDataURL(imageFile);
      } else if (imageFile && typeof imageFile === 'string') {
        // Handle base64 string if already processed
        profileImage.src = imageFile;
        profileImage.style.display = 'block';
        placeholder.style.display = 'none';
      } else {
        // Use initials placeholder
        profileImage.style.display = 'none';
        placeholder.style.display = 'flex';
      }
    }
    
    // Format date from yyyy-mm-dd to Mon Year
    function formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const options = { year: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }
    
    // Clear all containers
    function clearContainers() {
      document.getElementById('experienceContainer').innerHTML = '';
      document.getElementById('projectsContainer').innerHTML = '';
      document.getElementById('educationContainer').innerHTML = '';
      document.getElementById('skillsList').innerHTML = '';
      document.getElementById('achievementsList').innerHTML = '';
    }
    
    // Populate profile data
    function populateProfile(data) {
      if (!data) return;
      
      // Basic info
      document.getElementById('fullName').textContent = `${data.firstname || ''} ${data.lastname || ''}`.trim();
      document.getElementById('designationText').textContent = data.designation || 'Professional';
      document.getElementById('addressText').textContent = data.address || '';
      document.getElementById('emailText').textContent = data.email || '';
      document.getElementById('phoneText').textContent = data.phone || '';
      document.getElementById('summaryText').textContent = data.summary || '';
      
      // Profile image/placeholder
      const initials = `${(data.firstname ? data.firstname.charAt(0) : '')}${(data.lastname ? data.lastname.charAt(0) : '')}`;
      document.getElementById('profileImagePlaceholder').querySelector('span').textContent = initials;
      
      // For profile image, we can only get a URL string since File objects can't be stored in sessionStorage
      if (data.profileImageData) {
        handleProfileImage(data.profileImageData);
      }
    }
    
    // Create experience items
    function createExperienceItems(data) {
      const container = document.getElementById('experienceContainer');
      container.innerHTML = '';
      
      if (!data.exp_title || data.exp_title.length === 0) {
        container.innerHTML = '<div class="no-items">No experience details provided.</div>';
        return;
      }
      
      data.exp_title.forEach((title, index) => {
        if (!title) return;
        
        const startDate = formatDate(data.exp_start_date ? data.exp_start_date[index] : '');
        const endDate = formatDate(data.exp_end_date ? data.exp_end_date[index] : '');
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || '';
        
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.innerHTML = `
          <div class="title-row">
            <span class="title">${title}</span>
            <span>${dateRange}</span>
          </div>
          <div class="subtitle-row">
            <span class="subtitle">${data.exp_organization ? data.exp_organization[index] || '' : ''}</span>
            <span>${data.exp_location ? data.exp_location[index] || '' : ''}</span>
          </div>
          <p class="description">${data.exp_description ? data.exp_description[index] || '' : ''}</p>
        `;
        
        container.appendChild(experienceItem);
      });
    }
    
    // Create education items
    function createEducationItems(data) {
      const container = document.getElementById('educationContainer');
      container.innerHTML = '';
      
      if (!data.edu_degree || data.edu_degree.length === 0) {
        container.innerHTML = '<div class="no-items">No education details provided.</div>';
        return;
      }
      
      data.edu_degree.forEach((degree, index) => {
        if (!degree) return;
        
        const startDate = formatDate(data.edu_start_date ? data.edu_start_date[index] : '');
        const endDate = formatDate(data.edu_graduation_date ? data.edu_graduation_date[index] : '');
        const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || '';
        
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.innerHTML = `
          <div class="title-row">
            <span class="title">${degree}</span>
            <span>${dateRange}</span>
          </div>
          <div class="subtitle-row">
            <span class="subtitle">${data.edu_school ? data.edu_school[index] || '' : ''}</span>
            <span>${data.edu_city ? data.edu_city[index] || '' : ''}</span>
          </div>
          <p class="description">${data.edu_description ? data.edu_description[index] || '' : ''}</p>
        `;
        
        container.appendChild(educationItem);
      });
    }
    
    // Create project items
    function createProjectItems(data) {
      const container = document.getElementById('projectsContainer');
      container.innerHTML = '';
      
      if (!data.proj_title || data.proj_title.length === 0) {
        container.innerHTML = '<div class="no-items">No project details provided.</div>';
        return;
      }
      
      data.proj_title.forEach((title, index) => {
        if (!title) return;
        
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const linkHtml = data.proj_link && data.proj_link[index] ? 
          `<a href="${data.proj_link[index]}" class="project-link" target="_blank">${data.proj_link[index]}</a>` : '';
        
        projectItem.innerHTML = `
          <div class="title-row">
            <div class="project-title">
              <span class="title">${title}</span>
              ${linkHtml}
            </div>
          </div>
          <p class="description">${data.proj_description ? data.proj_description[index] || '' : ''}</p>
        `;
        
        container.appendChild(projectItem);
      });
    }
    
    // Create skill items
    function createSkillItems(data) {
      const container = document.getElementById('skillsList');
      container.innerHTML = '';
      
      if (!data.skill || data.skill.length === 0) {
        container.innerHTML = '<div class="no-items">No skills provided.</div>';
        return;
      }
      
      data.skill.forEach(skill => {
        if (!skill) return;
        
        const skillItem = document.createElement('li');
        skillItem.className = 'skill-tag';
        skillItem.textContent = skill;
        
        container.appendChild(skillItem);
      });
    }
    
    // Create achievement items
    function createAchievementItems(data) {
      const container = document.getElementById('achievementsList');
      container.innerHTML = '';
      
      if (!data.achieve_title || data.achieve_title.length === 0) {
        container.innerHTML = '<div class="no-items">No achievements provided.</div>';
        return;
      }
      
      data.achieve_title.forEach((title, index) => {
        if (!title) return;
        
        const achievementItem = document.createElement('li');
        achievementItem.className = 'achievement-item';
        achievementItem.innerHTML = `
          <strong>${title}</strong> - ${data.achieve_description ? data.achieve_description[index] || '' : ''}
        `;
        
        container.appendChild(achievementItem);
      });
    }
    
    // Process and display all form data
    function processFormData() {
      const formData = getFormData();
      if (!formData) {
        // Use placeholder data
        document.getElementById('fullName').textContent = 'John Doe';
        document.getElementById('designationText').textContent = 'Professional';
        document.getElementById('addressText').textContent = 'City, Country';
        document.getElementById('emailText').textContent = 'example@email.com';
        document.getElementById('phoneText').textContent = 'Phone Number';
        document.getElementById('summaryText').textContent = 'Your professional summary will appear here.';
        
        // Show placeholders for other sections
        return;
      }
      
      // Clear all containers
      clearContainers();
      
      // Populate all sections
      populateProfile(formData);
      createExperienceItems(formData);
      createEducationItems(formData);
      createProjectItems(formData);
      createSkillItems(formData);
      createAchievementItems(formData);
    }
    
    // Initialize the resume with data
    processFormData();
    
    // Navigation buttons - fix the back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        window.location.href = 'form.html';
      });
    }
    
    // Handle PDF download - using proper reference to jsPDF
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('resume');
        const actionsSection = document.querySelector('.actions-section');
        
        // Temporarily hide the buttons for capture
        actionsSection.style.display = 'none';
        
        // Make sure jsPDF is accessible
        if (typeof window.jspdf === 'undefined') {
          console.error('jsPDF library is not loaded properly');
          alert('PDF generation library not loaded. Please check your internet connection and try again.');
          actionsSection.style.display = 'block';
          return;
        }
        
        // Use proper namespace for jspdf
        const { jsPDF } = window.jspdf;
        
        html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('resume.pdf');
          
          // Show the buttons again
          actionsSection.style.display = 'block';
        }).catch(err => {
          console.error('Error generating PDF:', err);
          alert('There was an error generating the PDF. Please try again.');
          actionsSection.style.display = 'block';
        });
      });
    }
  });
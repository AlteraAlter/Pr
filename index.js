async function loadRecipes() {
    const response = await fetch('recipes.json');
    const recipes = await response.json();
  
    // Store all recipes for later filtering
    window.allRecipes = recipes;

    // Group recipes by category
    const recipesByCategory = recipes.reduce((acc, recipe) => {
      if (!acc[recipe.category]) acc[recipe.category] = [];
      acc[recipe.category].push(recipe);
      return acc;
    }, {});
  
    const container = document.getElementById('recipe-container');
  
    // Function to display recipes
    function displayRecipes(recipesToDisplay) {
      container.innerHTML = ''; // Clear previous results

      Object.keys(recipesByCategory).forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
    
        // Add category title
        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = category;
        categorySection.appendChild(title);
    
        // Create a grid to hold recipe cards
        const grid = document.createElement('div');
        grid.className = 'recipe-grid';
    
        const recipes = recipesByCategory[category];
        recipes.slice(0, 3).forEach(recipe => createRecipeCard(grid, recipe, category, recipe.id)); // Show first 3 by default
    
        // Add the grid to the category section
        categorySection.appendChild(grid);
    
        // Create and add "See More" button
        if (recipes.length > 3) {
          const seeMoreBtn = document.createElement('button');
          seeMoreBtn.className = 'see-more-btn';
          seeMoreBtn.textContent = 'See More';
          seeMoreBtn.onclick = () => {
            const isExpanded = seeMoreBtn.textContent === 'Show Less';
            grid.innerHTML = ''; // Clear the grid
    
            if (isExpanded) {
              recipes.slice(0, 3).forEach(recipe => createRecipeCard(grid, recipe, category, recipe.id));
              seeMoreBtn.textContent = 'See More';
            } else {
              recipes.forEach(recipe => createRecipeCard(grid, recipe, category, recipe.id));
              seeMoreBtn.textContent = 'Show Less';
            }
          };
          categorySection.appendChild(seeMoreBtn);
        }
    
        // Add the category section to the main container
        container.appendChild(categorySection);
      });
    }

    // Function to create recipe cards
    function createRecipeCard(grid, recipe, category, id) {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.onclick = () => openModal(id, category); // Call openModal with recipe ID and category
    
      // Add the image
      const image = document.createElement('img');
      image.src = recipe.image;
      card.appendChild(image);
    
      // Add the name
      const name = document.createElement('h2');
      name.textContent = recipe.name;
      card.appendChild(name);
    
      // Add ingredients and instructions (optional to keep it concise)
      const ingredients = document.createElement('div');
      ingredients.className = 'ingredients';
      ingredients.innerHTML = `<p>Ingredients:</p> ${recipe.ingredients.slice(0, 3).join(', ')} ...`;
      card.appendChild(ingredients);
    
      grid.appendChild(card);
    }

    displayRecipes(recipes); // Initial display of recipes
  
    // Search functionality
    const searchInput = document.querySelector('.searchbar input');
    searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase();
      
      // Filter the recipes by name
      const filteredRecipes = window.allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm)
      );

      displayRecipes(filteredRecipes); // Update the recipe display with the filtered recipes
    });
  }

  async function openModal(recipeId, category) {
    try {
      const response = await fetch('recipes.json');
      const recipes = await response.json();
      const recipeData = recipes.find(recipe => recipe.id === recipeId);
  
      document.getElementById("modal-title").textContent = recipeData.name;
      document.getElementById("modal-image").src = recipeData.image;
      document.getElementById("modal-category").textContent = recipeData.category;
  
      const ingredientsList = document.getElementById("modal-ingredients");
      ingredientsList.innerHTML = "";
      for (let i = 0; i < recipeData.ingredients.length; i++) {
        const li = document.createElement("li");
        li.textContent = `${recipeData.measures[i]} ${recipeData.ingredients[i]}`;
        ingredientsList.appendChild(li);
      }
  
      document.getElementById("modal-instructions").textContent = recipeData.instructions;
      modal.style.display = "block";
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  }
  
  // Modal close logic
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  
  span.onclick = function() {
    modal.classList.add('fade-out');  // Add fade-out animation
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove('fade-out');  // Remove fade-out class after animation
    }, 300);  // Delay matching the animation duration
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.classList.add('fade-out');  // Add fade-out animation
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('fade-out');  // Remove fade-out class after animation
      }, 300);  // Delay matching the animation duration
    }
  }

  // Load recipes when the page loads
  loadRecipes();

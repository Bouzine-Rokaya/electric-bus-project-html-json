// Fetching bus data from JSON
fetch("json.json")
  .then((response) => response.json())
  .then((data) => {
    const modelSelect = document.getElementById("busModel");
    data.busModels.forEach((bus) => {
      const option = document.createElement("option");
      option.value = bus.model;
      option.textContent = bus.model;
      modelSelect.appendChild(option);
    });

    document.querySelector(".calculate").addEventListener("click", () => {
      const selectedModel = modelSelect.value;
      const extraKm = parseFloat(document.getElementById("extraKm").value);
      const selectedOptions = Array.from(document.querySelectorAll("input[name='options']:checked"))
        .map(option => option.value);

      if (isNaN(extraKm)) {
        alert("Veuillez entrer une autonomie supplémentaire valide !");
        return;
      }

      const bus = data.busModels.find(b => b.model === selectedModel);
      const totalCost = calculateTotalCost(bus, extraKm, selectedOptions);

      displayCostDetails(bus, extraKm, selectedOptions, totalCost);
    });
  })
  .catch((error) => console.error("Erreur lors du chargement du JSON :", error));

// Function to calculate total cost
function calculateTotalCost(bus, extraKm, selectedOptions) {
  let totalCost = bus.basePrice;
  totalCost += extraKm * bus.batteryCostPerKm;

  selectedOptions.forEach(option => {
    totalCost += bus.options[option] || 0;
  });

  totalCost -= bus.governmentAid;

  return totalCost;
}

// Function to display cost details
function displayCostDetails(bus, extraKm, selectedOptions, totalCost) {
  const resultSection = document.querySelector(".result-section");
  resultSection.innerHTML = `
    <h3>Coût total pour ${bus.model}</h3>
    <p>Prix de base: ${bus.basePrice} MAD</p>
    <p>Coût de l'autonomie supplémentaire (${extraKm} km): ${extraKm * bus.batteryCostPerKm} MAD</p>
    <p>Options sélectionnées:</p>
    <ul>
      ${selectedOptions.map(option => `<li>${option}: ${bus.options[option]} MAD</li>`).join('')}
    </ul>
    <p>Aide financière: -${bus.governmentAid} MAD</p>
    <h4>Coût total: ${totalCost.toFixed(2)} MAD</h4>
  `;
  resultSection.style.display = "block";
} 

document.addEventListener("DOMContentLoaded", () => {
  const inputFields = document.getElementById("inputFields");

  const featureSchema = [
    { name: "Age", label: "Age (years)", type: "range", min: 10, max: 100, unit: "years" },
    { name: "Height", label: "Height (cm)", type: "range", min: 120, max: 210, unit: "cm" },
    { name: "Weight", label: "Weight (kg)", type: "range", min: 30, max: 160, unit: "kg" },
    { name: "Gender", label: "Gender", type: "select", options: ["Male", "Female"] },
    { name: "family_history_with_overweight", label: "Family History of Overweight", type: "select", options: ["yes", "no"] },
    { name: "FAVC", label: "Frequent High Calorie Food Consumption", type: "select", options: ["yes", "no"] },
    { name: "FCVC", label: "Vegetable Consumption (1=Low to 3=High)", type: "range", min: 1, max: 3 },
    { name: "NCP", label: "Meals per Day", type: "range", min: 1, max: 4 },
    { name: "CAEC", label: "Eating Between Meals", type: "select", options: ["no", "Sometimes", "Frequently"] },
    { name: "SMOKE", label: "Smoking Habit", type: "select", options: ["yes", "no"] },
    { name: "CH2O", label: "Water Intake (L/day)", type: "range", min: 1, max: 10, unit: "L/day" },
    { name: "SCC", label: "Calorie Monitoring", type: "select", options: ["yes", "no"] },
    { name: "FAF", label: "Physical Activity (hrs/week)", type: "range", min: 0, max: 14, unit: "hrs/week" },
    { name: "TUE", label: "Screen Time (hrs/day)", type: "range", min: 0, max: 12, unit: "hrs/day" },
    { name: "CALC", label: "Alcohol Consumption", type: "select", options: ["no", "Sometimes", "Frequently"] },
    { name: "MTRANS", label: "Transportation Mode", type: "select", options: ["Automobile", "Motorbike", "Bike", "Public_Transportation", "Walking"] }
  ];

  featureSchema.forEach(feature => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper");

    const label = document.createElement("label");
    label.textContent = feature.label;
    wrapper.appendChild(label);

    let input;

    if (feature.type === "range") {
      input = document.createElement("input");
      input.type = "range";
      input.name = feature.name;
      input.min = feature.min;
      input.max = feature.max;
      input.value = Math.floor((feature.min + feature.max) / 2);
      input.step = 1;

      const valueDisplay = document.createElement("span");
      valueDisplay.textContent = `${input.value} ${feature.unit || ""}`;
      valueDisplay.style.marginLeft = "10px";
      valueDisplay.style.fontWeight = "bold";

      input.addEventListener("input", () => {
        valueDisplay.textContent = `${input.value} ${feature.unit || ""}`;
      });

      wrapper.appendChild(input);
      wrapper.appendChild(valueDisplay);
    }

    if (feature.type === "select") {
      input = document.createElement("select");
      input.name = feature.name;

      feature.options.forEach((opt, i) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (i === 0) option.selected = true;
        input.appendChild(option);
      });

      wrapper.appendChild(input);
    }

    inputFields.appendChild(wrapper);
  });

  document.getElementById("predictForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target).entries());
    const resultDiv = document.getElementById("result");
    const suggestionsDiv = document.getElementById("suggestions");

    resultDiv.textContent = "Waking server… please wait ⏳";
    resultDiv.style.color = "#888";
    suggestionsDiv.innerHTML = "";

    try {
      const response = await fetch(
        "https://obesity-risk-prediction-model-backend-1-1.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        resultDiv.innerHTML = `
          <p><strong>Model Prediction:</strong> ${result.model_prediction}</p>
          <p><strong>BMI-Based Class:</strong> ${result.corrected_prediction}</p>
          <p><strong>Category:</strong> ${result.category}</p>
          <p><strong>BMI:</strong> ${result.bmi}</p>
        `;
        resultDiv.style.color = "#333";

        if (result.suggestions?.length) {
          suggestionsDiv.innerHTML = `
            <h3>Lifestyle Suggestions</h3>
            <ul>${result.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>
          `;
        }
      } else {
        resultDiv.textContent = `❌ ${result.error || "Prediction failed"}`;
        resultDiv.style.color = "#bf616a";
      }
    } catch (err) {
      resultDiv.textContent = "❌ Backend unreachable (Render sleeping or URL wrong)";
      resultDiv.style.color = "#bf616a";
    }
  });
});




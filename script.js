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
    { name: "NCP", label: "Number of Meals per Day", type: "range", min: 1, max: 4 },
    { name: "CAEC", label: "Eating Between Meals", type: "select", options: ["no", "Sometimes", "Frequently"] },
    { name: "SMOKE", label: "Smoking Habit", type: "select", options: ["yes", "no"] },
    { name: "CH2O", label: "Water Intake (liters/day)", type: "range", min: 1, max: 10, unit: "L/day" },
    { name: "SCC", label: "Calorie Monitoring", type: "select", options: ["yes", "no"] },
    { name: "FAF", label: "Physical Activity (hrs/week)", type: "range", min: 0, max: 14, unit: "hrs/week" },
    { name: "TUE", label: "Screen Time (hrs/day)", type: "range", min: 0, max: 12, unit: "hrs/day" },
    { name: "CALC", label: "Alcohol Consumption", type: "select", options: ["no", "Sometimes", "Frequently"] },
    { name: "MTRANS", label: "Mode of Transportation", type: "select", options: ["Automobile", "Motorbike", "Bike", "Public_Transportation", "Walking"] }
  ];

  featureSchema.forEach(feature => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper");

    const label = document.createElement("label");
    label.setAttribute("for", feature.name);
    label.textContent = feature.label;
    wrapper.appendChild(label);

    let input;
    if (feature.type === "range") {
      input = document.createElement("input");
      input.type = "range";
      input.name = feature.name;
      input.id = feature.name;
      input.min = feature.min;
      input.max = feature.max;
      input.value = Math.floor((feature.min + feature.max) / 2);
      input.step = 1;
      input.required = true;
      input.title = `Range: ${feature.min}-${feature.max} ${feature.unit || ""}`.trim();

      const valueDisplay = document.createElement("span");
      valueDisplay.textContent = `${input.value} ${feature.unit || ""}`;
      valueDisplay.style.marginLeft = "10px";
      valueDisplay.style.fontWeight = "bold";

      input.addEventListener("input", () => {
        valueDisplay.textContent = `${input.value} ${feature.unit || ""}`;
      });

      wrapper.appendChild(input);
      wrapper.appendChild(valueDisplay);

    } else if (feature.type === "select") {
      input = document.createElement("select");
      input.name = feature.name;
      input.id = feature.name;
      input.required = true;

      feature.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });

      wrapper.appendChild(input);
    }

    inputFields.appendChild(wrapper);
  });

  // Handle prediction
  document.getElementById("predictForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Predicting...";
    resultDiv.style.color = "#88c0d0";

    try {
      const response = await fetch("https://web-production-9048c.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const categoryMap = {
        "Insufficient_Weight": "Underweight",
        "Normal_Weight": "Healthy",
        "Overweight_Level_I": "Borderline Obese",
        "Overweight_Level_II": "Borderline Obese",
        "Obesity_Type_I": "Obese (Class 1)",
        "Obesity_Type_II": "Obese (Class 2)",
        "Obesity_Type_III": "Obese (Morbid)"
      };

      const displayLabel = result.prediction ? categoryMap[result.prediction] || result.prediction : null;

      resultDiv.innerHTML = result.prediction
        ? `Predicted Class: <strong>${result.prediction}</strong><br>Category: <strong>${displayLabel}</strong> <button id="copyBtn">📋 Copy</button>`
        : `❌ Error: ${result.error || "Something went wrong"}`;

      resultDiv.style.color = result.prediction ? "#a3be8c" : "#bf616a";

      if (result.prediction) {
        document.getElementById("copyBtn").onclick = () => {
          navigator.clipboard.writeText(`${result.prediction} (${displayLabel})`);
          document.getElementById("copyBtn").textContent = "✅ Copied";
        };
      }

    } catch (error) {
      resultDiv.textContent = "Server error. Is Flask running?";
      resultDiv.style.color = "#bf616a";
    }
  });
});




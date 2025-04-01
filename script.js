let currentStep = 1;
let currentConsultorio = 1;
let totalConsultorios = 1;
const consultorioData = {}; 

function showStep(step) {
    document.querySelectorAll('.step').forEach((el) => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    document.querySelectorAll('.sidebar li').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === step);
    });
}

function nextStep(step) {
    if (validateStep(step)) {
        if (step === 3 && currentConsultorio < totalConsultorios) {
            saveConsultorioData(currentConsultorio);
            currentConsultorio++;
            loadConsultorioData(currentConsultorio);
        } else {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep(step) {
    if (step === 3 && currentConsultorio > 1) {
        saveConsultorioData(currentConsultorio);
        currentConsultorio--;
        loadConsultorioData(currentConsultorio);
    } else {
        currentStep--;
        showStep(currentStep);
    }
}

function validateStep(step) {
    let inputs = document.querySelectorAll(`#step${step} input`);
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert("Por favor, completa todos los campos.");
            return false;
        }
    }
    return true;
}

function saveConsultorioData(index) {
    consultorioData[index] = {
        horarios: document.getElementById("horarios").value,
        pais: document.getElementById("pais").value,
        estado: document.getElementById("estado").value,
        calle: document.getElementById("calle").value,
        numero: document.getElementById("numero").value,
        codigoPostal: document.getElementById("codigo-postal").value
    };
}

function loadConsultorioData(index) {
    document.getElementById("titulo-consultorio").textContent = `Datos Consultorio ${index}`;
    document.getElementById("horarios").value = consultorioData[index]?.horarios || "";
    document.getElementById("pais").value = consultorioData[index]?.pais || "";
    document.getElementById("estado").value = consultorioData[index]?.estado || "";
    document.getElementById("calle").value = consultorioData[index]?.calle || "";
    document.getElementById("numero").value = consultorioData[index]?.numero || "";
    document.getElementById("codigo-postal").value = consultorioData[index]?.codigoPostal || "";
}

document.getElementById('multiStepForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('multiStepForm').style.display = 'none';
    document.getElementById('successMessage').classList.remove('hidden');
});

document.addEventListener("DOMContentLoaded", function () {
    const numConsultoriosInput = document.getElementById("num-consultorios");
    const sidebar = document.querySelector(".sidebar ul");
    const step3 = document.getElementById("step3");

    numConsultoriosInput.addEventListener("input", function () {
        totalConsultorios = Math.max(1, parseInt(numConsultoriosInput.value) || 1);

        
        document.querySelectorAll(".sidebar li.consultorio-step").forEach(el => el.remove());

        
        for (let i = 2; i <= totalConsultorios; i++) {
            let stepItem = document.createElement("li");
            stepItem.classList.add("consultorio-step");
            stepItem.textContent = `Step 3.${i - 1} \n Datos Consultorio ${i}`;
            sidebar.appendChild(stepItem);
        }

        
        if (totalConsultorios > 1) {
            numConsultoriosInput.style.visibility = "visible"; // seguro lo voy a tener que modificar
        } else {
            numConsultoriosInput.style.visibility = "visible"; // the same
        }        

        
        currentConsultorio = 1;
        consultorioData[1] = {};
        loadConsultorioData(1);
    });
});
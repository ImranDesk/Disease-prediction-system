import csv
import json
import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import diseaseprediction
#import mySQLdb

app = Flask(__name__, static_url_path='/static')
#conn = MySQLdb.connect(host='localhost',user='root',password='',db='disease_database')

# Load disease information from JSON file
disease_info_file = os.path.join('static', 'data', 'disease_info.json')
if not os.path.exists(os.path.dirname(disease_info_file)):
    os.makedirs(os.path.dirname(disease_info_file))

# Create disease info file if it doesn't exist
if not os.path.exists(disease_info_file):
    disease_info = {
        "Common Cold": {
            "description": "The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way. Many types of viruses can cause a common cold.",
            "symptoms": ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches", "Mild headache", "Sneezing", "Low-grade fever", "Generally feeling unwell"],
            "treatments": ["Rest", "Stay hydrated", "Use over-the-counter cold medications", "Gargle with salt water", "Use saline nasal drops", "Take pain relievers"],
            "prevention": ["Wash your hands frequently", "Avoid close contact with sick people", "Don't touch your face with unwashed hands", "Clean frequently touched surfaces", "Strengthen your immune system"]
        },
        "Pneumonia": {
            "description": "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing.",
            "symptoms": ["Chest pain when breathing or coughing", "Confusion (in older people)", "Cough with phlegm", "Fatigue", "Fever, sweating and shaking chills", "Lower than normal body temperature (in older people)", "Nausea, vomiting or diarrhea", "Shortness of breath"],
            "treatments": ["Antibiotics for bacterial pneumonia", "Cough medicine", "Fever reducers/pain relievers", "Hospitalization for severe cases"],
            "prevention": ["Vaccination", "Good hygiene practices", "Avoid smoking", "Keep your immune system strong", "Avoid close contact with sick people"]
        },
        "Diabetes": {
            "description": "Diabetes is a disease that occurs when your blood glucose (blood sugar) is too high. Blood glucose is your main source of energy and comes from the food you eat. Insulin, a hormone made by the pancreas, helps glucose get into your cells to be used for energy.",
            "symptoms": ["Increased thirst", "Frequent urination", "Extreme hunger", "Unexplained weight loss", "Fatigue", "Irritability", "Blurred vision", "Slow-healing sores", "Frequent infections"],
            "treatments": ["Insulin therapy", "Blood sugar monitoring", "Healthy eating", "Regular exercise", "Medication", "Weight loss if overweight"],
            "prevention": ["Eat healthy foods", "Get more physical activity", "Lose excess weight", "Quit smoking", "Limit alcohol intake"]
        },
        "Malaria": {
            "description": "Malaria is a disease caused by a parasite that is transmitted to people through the bites of infected female Anopheles mosquitoes. It is preventable and curable.",
            "symptoms": ["Fever", "Chills", "Headache", "Nausea and vomiting", "Muscle pain and fatigue", "Sweating", "Chest or abdominal pain", "Cough"],
            "treatments": ["Antimalarial drugs", "Supportive care", "Hydration", "Rest"],
            "prevention": ["Use insect repellent", "Cover exposed skin", "Sleep under an insecticide-treated mosquito net", "Indoor residual spraying", "Antimalarial medications for travelers"]
        },
        "Hypertension": {
            "description": "Hypertension, also known as high blood pressure, is a long-term medical condition in which the blood pressure in the arteries is persistently elevated.",
            "symptoms": ["Most people have no symptoms", "Some may experience headaches", "Shortness of breath", "Nosebleeds", "Visual changes", "Dizziness"],
            "treatments": ["Blood pressure medications", "Lifestyle changes", "Regular monitoring"],
            "prevention": ["Maintain a healthy weight", "Regular physical activity", "Healthy diet low in sodium", "Limit alcohol", "No smoking", "Manage stress", "Regular health screenings"]
        }
    }
    
    with open(disease_info_file, 'w') as f:
        json.dump(disease_info, f, indent=4)
else:
    with open(disease_info_file, 'r') as f:
        disease_info = json.load(f)

with open('templates/Testing.csv', newline='') as f:
        reader = csv.reader(f)
        symptoms = next(reader)
        symptoms = symptoms[:len(symptoms)-1]

@app.route('/', methods=['GET'])
def dropdown():
        return render_template('includes/default.html', symptoms=symptoms)



@app.route('/disease_predict', methods=['POST'])
def disease_predict():
    selected_symptoms = []
    symptom_details = {}
    
    # Get symptoms and their details
    for i in range(1, 6):
        symptom_key = f'Symptom{i}'
        if request.form[symptom_key] and request.form[symptom_key] not in selected_symptoms:
            selected_symptoms.append(request.form[symptom_key])
            
            # Get severity if provided
            severity_key = f'severity{i}'
            if severity_key in request.form:
                severity = request.form[severity_key]
            else:
                severity = "5"  # Default value
                
            # Get duration if provided
            duration_key = f'duration{i}'
            if duration_key in request.form:
                duration = request.form[duration_key]
            else:
                duration = ""
                
            symptom_details[request.form[symptom_key]] = {
                "severity": severity,
                "duration": duration
            }
    
    # Get disease prediction
    disease = diseaseprediction.dosomething(selected_symptoms)
    
    # Get disease information if available
    disease_name = disease[0]
    info = disease_info.get(disease_name, {
        "description": "No detailed information available for this condition.",
        "symptoms": [],
        "treatments": [],
        "prevention": []
    })
    
    return render_template('disease_predict.html', 
                          disease=disease, 
                          symptoms=symptoms, 
                          selected_symptoms=selected_symptoms,
                          symptom_details=symptom_details,
                          disease_info=info)

@app.route('/find_doctor', methods=['POST'])
def get_location():
    location = request.form['doctor']
    
    # Get specialty if provided
    specialty = request.form.get('specialty', '')
    
    # Get distance radius if provided
    radius = request.form.get('radius', '2000')
    
    # Get ratings filter if provided
    min_rating = request.form.get('min_rating', '0')
    
    return render_template('find_doctor.html', 
                          location=location, 
                          symptoms=symptoms,
                          specialty=specialty,
                          radius=radius,
                          min_rating=min_rating)

@app.route('/api/disease_info/<disease_name>', methods=['GET'])
def api_disease_info(disease_name):
    info = disease_info.get(disease_name, {
        "description": "No detailed information available for this condition.",
        "symptoms": [],
        "treatments": [],
        "prevention": []
    })
    return jsonify(info)

@app.route('/drug', methods=['POST'])
def drugs():
    medicine = request.form['medicine']
    return render_template('homepage.html', medicine=medicine, symptoms=symptoms)

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
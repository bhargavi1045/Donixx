from flask import Blueprint, render_template
from flask import request, jsonify
from app.utils.imageReader import get_extracted_text,answer_from_image_text
from app.utils.chatBot import chat_interface
import uuid
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Flask Application is running!"

@main.route("/image-reader")
def image_reader():
    return render_template("imageReader.html")

@main.route("/image-reader", methods=["POST"])
def image_reader_post():
    if "image" not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400

    image_blob = request.files["image"].read()
    
    try:
        extracted_text = get_extracted_text(image_blob)
        
        if not extracted_text:
            return jsonify({'message': 'No text found in the image'}), 400
        
        answer_from_image_text_response = answer_from_image_text("What is the image about?", extracted_text)
        
        return jsonify({
            'extracted_text': extracted_text,
            'answer_from_image_text': answer_from_image_text_response
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error processing the image: {str(e)}'}), 500
    
@main.route("/donix-chat")
def donix_chat():
    return render_template("chatBot.html")

@main.route("/ask-question", methods=["POST"])
def ask_question():
    question = request.json.get("question")
    language = request.json.get("language", "English")
    
    if not question:
        return jsonify({"error": "Question is required"}), 400
    
    response = chat_interface(question, language=language, session_id=str(uuid.uuid4()))
    if not response:
        return jsonify({"error": "No response from chat interface"}), 500

    res = {
        "question": question,
        "language": language,
        "answer": f"{response}",
    }
    
    return jsonify(res), 200


from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/excel-data', methods=['GET'])
def get_excel_data():
    try:
        excel_path = os.path.join(os.path.dirname(__file__), 'data.xlsx')
        if not os.path.exists(excel_path):
            return jsonify({'error': 'Excel file not found'}), 404
        df = pd.read_excel(excel_path)
        data = df.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Excel Flask Server running on http://localhost:5001")
    app.run(port=5001, debug=True)

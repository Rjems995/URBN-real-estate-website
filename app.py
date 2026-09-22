"""
URBN Real Estate - Web Application Server
A luxury architectural property showcase and discovery platform.
"""

import json
import os
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__)
app.config['SECRET_KEY'] = 'urbn-luxury-real-estate-secret-key-2026'

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'properties.json')

def load_properties():
    """Load properties data from JSON repository."""
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading properties: {e}")
        return []

def get_property_by_id(property_id):
    """Retrieve single property dictionary by unique ID."""
    properties = load_properties()
    for prop in properties:
        if prop.get('id') == property_id:
            return prop
    return None

@app.route('/')
def home():
    """
    Landing page: Directly displays the star modernist villa listing (Benevento Villa),
    faithfully matching the user's reference screenshot.
    """
    prop = get_property_by_id('benevento-villa')
    if not prop:
        properties = load_properties()
        prop = properties[0] if properties else None
    
    # Get similar listings (excluding this one)
    all_props = load_properties()
    similar = [p for p in all_props if p.get('id') != prop.get('id')][:3]
    
    return render_template('property_detail.html', property=prop, similar_properties=similar)

@app.route('/property/<property_id>')
def property_detail(property_id):
    """Specific property detail page."""
    prop = get_property_by_id(property_id)
    if not prop:
        abort(404)
    
    all_props = load_properties()
    similar = [p for p in all_props if p.get('id') != property_id][:3]
    return render_template('property_detail.html', property=prop, similar_properties=similar)

@app.route('/catalog')
def catalog():
    """Property catalog with search and category filters."""
    properties = load_properties()
    query = request.args.get('q', '').strip().lower()
    category = request.args.get('category', '').strip()
    tag = request.args.get('tag', '').strip().lower()
    max_price = request.args.get('max_price', type=float)

    filtered = []
    for p in properties:
        # Search text match
        if query:
            searchable_text = f"{p.get('title', '')} {p.get('location', '')} {p.get('city', '')} {p.get('description', '')}".lower()
            if query not in searchable_text:
                continue
        
        # Category filter
        if category and category.lower() != 'all':
            if p.get('category', '').lower() != category.lower():
                continue
        
        # Tag filter
        if tag:
            tags = [t.lower() for t in p.get('tags', [])]
            if not any(tag in t for t in tags):
                continue
        
        # Max price filter
        if max_price and p.get('price', 0) > max_price:
            continue
            
        filtered.append(p)

    return render_template('index.html', properties=filtered)

@app.route('/api/calculate-mortgage', methods=['POST'])
def api_calculate_mortgage():
    """API endpoint to calculate mortgage terms and monthly breakdown."""
    data = request.get_json() or {}
    price = float(data.get('price', 1528950))
    down_percent = float(data.get('down_percent', 20))
    interest_rate = float(data.get('interest_rate', 6.5))
    term_years = int(data.get('term_years', 30))
    
    down_payment = (price * down_percent) / 100.0
    principal = max(0.0, price - down_payment)
    monthly_rate = (interest_rate / 100.0) / 12.0
    total_months = term_years * 12

    if principal > 0 and monthly_rate > 0:
        monthly_pi = principal * (monthly_rate * (1 + monthly_rate)**total_months) / ((1 + monthly_rate)**total_months - 1)
    elif principal > 0:
        monthly_pi = principal / total_months
    else:
        monthly_pi = 0.0

    monthly_tax = (price * 0.0085) / 12.0
    monthly_insurance = 2400.0 / 12.0
    monthly_total = monthly_pi + monthly_tax + monthly_insurance

    return jsonify({
        'price': price,
        'down_payment': round(down_payment, 2),
        'principal': round(principal, 2),
        'monthly_pi': round(monthly_pi, 2),
        'monthly_tax': round(monthly_tax, 2),
        'monthly_insurance': round(monthly_insurance, 2),
        'monthly_total': round(monthly_total, 2),
        'total_repayment': round(monthly_pi * total_months, 2)
    })

@app.route('/api/contact', methods=['POST'])
def api_contact():
    """Lead capture endpoint for property inquiries and private showings."""
    data = request.get_json() or request.form.to_dict()
    name = data.get('name', 'Client')
    email = data.get('email', '')
    property_title = data.get('property_title', 'URBN Residence')
    
    # In production, this would dispatch an email / CRM webhook
    return jsonify({
        'status': 'success',
        'message': f"Thank you, {name}! Your inquiry for '{property_title}' has been dispatched to Floors Agency. Senior Broker Alessandro Moretti will be in touch shortly."
    })

@app.route('/api/properties', methods=['GET'])
def api_properties():
    """Returns all listings in JSON format."""
    return jsonify(load_properties())

@app.errorhandler(404)
def not_found(e):
    return render_template('base.html'), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"URBN Luxury Real Estate running on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=True)


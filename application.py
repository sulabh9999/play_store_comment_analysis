from flask import Flask, render_template, request, url_for, jsonify
import json
from web.db.dbWebQuery import DBWebQuery

application = Flask(__name__, template_folder='web/templates', static_folder='web/static')
application.config.update(
	JSON_SORT_KEYS = False
)

db = DBWebQuery()


@application.route('/')
def index():
	return render_template('index.html')
	


def getFormInput(request):
	dgStartDate=request.form['dg-startDate']
	dgEndDate=request.form['dg-endDate']
	dgContry = request.form.get('dg-contry')
	dgPlatform = request.form.get('dg-platform')
	return (dgStartDate, dgEndDate,  dgContry, dgPlatform)


# call comes from AJAX js (pieChart.js)
@application.route('/pieChart', methods=['GET','POST'])
def pieChart():
	print (request)
	if request.method == 'GET':
		print('... this is GET method:')
		return render_template('index.html')
	if request.method == 'POST':
		print('... this is POST method:')
		dgStartDate, dgEndDate, dgContry, dgPlatform = getFormInput(request)
		queryResult = db.getChartData(dgStartDate, dgEndDate, dgContry, dgPlatform, top=5, isNegative=True)
		return jsonify(queryResult);



# call comes from AJAX js (pieChart.js)
@application.route('/barChart', methods=['GET','POST'])
def barChart():
	print (request)
	if request.method == 'GET':
		print('... this is GET method:')
		return render_template('index.html')
	if request.method == 'POST':
		print('... this is POST method:')
		dgStartDate, dgEndDate, dgContry, dgPlatform = getFormInput(request)
		queryResult = db.getChartData(dgStartDate, dgEndDate, dgContry, dgPlatform, top=5, isNegative=False)
		# print('queryResult: queryResult:', queryResult)
		return jsonify(queryResult)


# need to implement
@application.route('/lineChart', methods=['GET','POST'])
def lineChart():
	print (request)
	if request.method == 'GET':
		print('... this is GET method:')
		return render_template('lineChart.html')
	if request.method == 'POST':
		print('... this is POST method:')
		queryResult = db.getLineChart('banking', '2019-01-01', '2019-04-01', 'india', 'ios')
		# dgStartDate, dgEndDate, dgContry, dgPlatform = getFormInput(request)
		# queryResult = db.getChartData(dgStartDate, dgEndDate, dgContry, dgPlatform, top=5, isNegative=False)
		return jsonify(queryResult)


if __name__ == '__main__':
	application.run(debug=True)

	

	
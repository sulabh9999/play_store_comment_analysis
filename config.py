class Test:
    HOST = 'localhost'
    PORT = ''
    USER = 'sulabh'
    PASSWORD = '12345'
    DB = 'DGIndia'


class Production:
    HOST = 'mydbinstance.ccvvnp4haszt.us-west-2.rds.amazonaws.com'
    PORT = 3301
    USER = 'mysqldbadmin'
    PASSWORD = 'mysqldbadmin'
    DB = 'DGIndia'


# database configuration class
class Config:

    # change db configuration here
    ___config = Production()

    # public parameters
    host = ___config.HOST
    port = ___config.PORT
    user = ___config.USER
    password = ___config.PASSWORD
    db = ___config.DB

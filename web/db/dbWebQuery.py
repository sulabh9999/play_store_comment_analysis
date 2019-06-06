# contains queries for web cupport
from web.db.dbCore import DBCore
from web.config.sConstants import SConstants
import json
# import datetime
from pprint import pprint

def showLog(message, more=''):
    print('\n'+message, more)
    pass

def showQuery(query):
    # print('\n quert is: '+query)
    pass



class DBWebQuery(DBCore):

    def __init__(self, db='DGIndia'):
        super(DBWebQuery, self).__init__(db)
        self.table = SConstants.table.master


    def __execute(self, query):
        showQuery(query)
        rows = self.execute(query) 
        return json.dumps(rows)


    def __setIsNegative(self, isNegative, columnName='rating'):
        if isNegative:
            data = (columnName, SConstants.web.negIfLessThan)
            return """%s < %s""" % data # rating < 3
        else:
            data = (columnName, SConstants.web.posIfGreaterThan)
            return """%s > %s""" % data # rating > 3



    # returns "2018-12-30 AND 2019-01-21 AND rating > 3"
    def __setDefaultQuery(self, start, end ,isNegative=True, columnName='rating'):
        return """date BETWEEN '%s' AND '%s' AND %s""" % (start, end, self.__setIsNegative(isNegative, columnName))
    




    # get Top n frequen element from table
    def __getHotTopics(self, start, end, column, total, table=SConstants.table.master, isNegative=True):      
        #SELECT `topic`, COUNT(`topic`) AS `value_occurrence` FROM `dbs_master_2` WHERE rating < 3 GROUP BY topic ORDER BY `value_occurrence` DESC LIMIT 5
        parm = (column, column, table, self.__setDefaultQuery(start, end, isNegative), column, total)
        # q= """SELECT * FROM """+ table
        query = """SELECT %s, COUNT(%s) AS `value_occurrence` FROM %s WHERE %s GROUP BY %s ORDER BY `value_occurrence` DESC LIMIT %d"""
        return self.__execute(query % parm)
        # print('this is output: ', self.__execute(q))





        # get Top n frequen element from table
    def __getReasonForTopic(self, start, end, topic, total, isNegative=True):
        table=SConstants.table.master
        reasonColumn = 'reason'
        topicColumn = 'topic'
        # SELECT `reason`, COUNT(`reason`) AS `value_occurrence` FROM `dbs_master_2` WHERE `topic`= "app" rating < 3 GROUP BY reason ORDER BY `value_occurrence` DESC LIMIT 5      
        parm = (reasonColumn, reasonColumn, table, topicColumn, topic, self.__setDefaultQuery(start, end, isNegative), reasonColumn, total)
        query = """SELECT %s, COUNT(%s) AS `value_occurrence` FROM %s WHERE %s = '%s' and %s  GROUP BY %s ORDER BY `value_occurrence` DESC LIMIT %d"""
        return self.__execute(query % parm)




    def getComment(self, start, end, commentsCount, topic, reason, isNegative=True):
        table=SConstants.table.master
        parm = (table, topic, reason, self.__setDefaultQuery(start, end, isNegative), commentsCount)
        # SELECT comment_id, processed_comment FROM dbs_comments WHERE comment_id IN (SELECT * FROM ( SELECT `comment_id` FROM dbs_master_2 WHERE topic="app" AND reason="good" AND date "2018-09-21" AND "2019-09-15" LIMIT 5) AS comment_list)
        q1 = """(SELECT `comment_id` FROM %s WHERE topic="%s" AND reason="%s" AND %s LIMIT %d) AS commentList"""
        q1 = (q1 % parm)
        parm = (SConstants.table.platform('android'), q1)
        q2 = """SELECT comment_id, processed_comment FROM %s WHERE comment_id IN (SELECT * FROM %s)"""
        q2 = (q2 % parm)
        # showLog('q2 is:', q2) 
        return self.__execute(q2)




    def getChartData(self, start, end, country, platform, top, isNegative=True):
        showLog('start: ', start)
        showLog('end: ', end)
        showLog('country: ', country)
        showLog('platform: ', platform)
        finalResult = []
        topicJson = self.__getHotTopics(start, end, 'topic', top, self.table, isNegative)
        topicDict = json.loads(topicJson) 

        for topic, frequency in topicDict:
                reasonList = self.__getReasonForTopic(start, end, topic, 6, isNegative)
                reasonList = json.loads(reasonList)
                reasonResult = []
                commentsCount = 1
                for each in reasonList:
                    reason = each[0]
                    if len(reason) > 0:
                        commentsJson = self.getComment(start, end, commentsCount, topic, reason, isNegative)        
                        commentsArray = json.loads(commentsJson)
                        each.append(commentsArray)
                        reasonResult.append(each)
                        # showLog('one comment for reason --%s-- %s: ' % (reason, commentsArray))

                # showLog('reasonResult: ', reasonResult)
                
                pair = (topic, [frequency, reasonResult])
                finalResult.append(pair)

        return finalResult




############################# line chart ######################

    def __executeJson(self, query):
        showQuery(query)
        jsonResult = self.executeWithHeader(query) 
        print('show query output:', jsonResult)
        return jsonResult


    def __getFreqForReason(self, reason, countTag, dateQuery, country, platform):
        # select `date` as weekOf, SUM(reason) from dbs_master_2 where `date` between '2018-01-01' and '2019-03-01' AND reason='banking' group by week(`date`)
        # group by week
        # select `date` as weekOf, COUNT(`reason`) as freq from dbs_master_2 where `date` between '2019-01-01' and '2019-03-01' AND reason='banking' group by week(`date`)
        # by month/year
        # ... group by month/year(`date`)
        table=SConstants.table.master
        reasonColumn = 'reason'
        dateColumn = 'date'
        # SELECT `reason`, COUNT(`reason`) AS `value_occurrence` FROM `dbs_master_2` WHERE `topic`= "app" rating < 3 GROUP BY reason ORDER BY `value_occurrence` DESC LIMIT 5      
        parm = (dateColumn, reasonColumn, countTag, table, dateQuery, reason, dateColumn)
        query = """select %s, COUNT(%s) as %s from %s where %s AND reason='%s' group by week(%s)"""
        print('query is:', query % parm)
        return self.__executeJson(query % parm)



    def getLineChart(self, reason, start, end, country, platform):
        # fetch negative graph data
        dateQuery = self.__setDefaultQuery(start, end, isNegative=False)
        pgJsonData = self.__getFreqForReason(reason, 'pCount', dateQuery, country, platform)
        pgData = pgJsonData #json.load(pgJsonData)

        # fetch positive graph data
        dateQuery = self.__setDefaultQuery(start, end, isNegative=True)
        ngJsonData = self.__getFreqForReason(reason, 'nCount', dateQuery, country, platform)
        ngData = ngJsonData #json.load(ngJsonData)

        # merge both into one list
        bigList = ngData if len(ngData) > len(pgData) else pgData
        smallList = ngData if len(ngData) < len(pgData) else pgData

        def setDefault(each):
            print(each)
            return each


        finalResult = []
        # bigList = map(setDefault, bigList)

        # maxLen = max(ngData, pgData) # since lenth of both array is same, so took anyone
        # for i in range(maxLen):
        #     # if 
        #     print('postive:', pgData[i])
        #     print('negative:', ngData[i])
        #     # merged = set(negativeGraphData[i], positiveGraphData[i])
        #     # finalResult.append(merged)

        return bigList
        
        


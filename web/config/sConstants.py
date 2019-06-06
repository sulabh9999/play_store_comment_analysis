virtual_env = 'VIRTUAL_ENV'
comments_path = 'comments_path'
emoji_path = 'emoji_path'
wordFile_path = 'wordFile_path'
topic_path = "topic_path"
n_reason_path = "n_reason_path"
p_reason_path = 'p_reason_path'
 
base = '/home/nawaz/PycharmProjects/'
basepkl = base + 'SentimentAnalysis/pkl/'

# This is old and 'depricated', avoid using it.
commentsFilePath = basepkl + 'dgIndia_android_29Feb19_07April19.pkl'
commentsFilePathOutput = basepkl + 'dgIndia_android_29Feb19_07April19_output.pkl'

topicFilePath = base+'sentmentAnaProj/topics'
nReasonFilePath = base+'sentmentAnaProj/N_reasons'


class SConstants:
    
    class table:
        nReason = 'dbs_n_reasons'
        pReason = 'dbs_p_reasons'
        topic = 'dbs_topics'
        allKeyword = 'dbs_allKeywords'
        preprocessed = 'dbs_preprocessed'
        master = 'dbs_master_2'

        @staticmethod
        def platform(platform):
            if platform is 'ios':
                return 'dbs_comments' # need to add 'comment in dbs_android_2019 table' and replace 'dbs_comments' with it.
            else:
                return 'dbs_comments'
            

        
    class localFiles:
        allKeywords = base+'sentmentAnaProj/wordList'
        topics = base+'sentmentAnaProj/topics'
        nReasons = base+'sentmentAnaProj/N_reasons'
        pReasons = base+'sentmentAnaProj/P_reasons'
        
    class pkl:
        source = basepkl + 'dgIndia_android_till_24April2019.pkl'
        destination = basepkl + 'dgIndia_android_24April2019_output.pkl'

    class date:
        start = '1-01-2018'
        end = '24-04-2019'

    class web:
        negIfLessThan = 3
        posIfGreaterThan = 3
        
        
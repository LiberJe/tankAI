import requests
import random
import json

class Client(object):
    def __init__(self, server_ip, server_port, gameid):
        self.uri = 'http://' + server_ip + ':' + server_port
        self.gameid = gameid
        self.side   = 'blue'

    def setup(self):
        url = self.uri + '/game/' + self.gameid + '/match/' + self.side
        return requests.get(url).json()

    def act(self, jsondata):
        url = self.uri + '/game/' + self.gameid + '/match/' + self.side
        return requests.post(url, json=jsondata).json()

    def sample(self, state):
        actions = {
            0: 'fire',
            1: 'left',
            2: 'right',
            3: 'stay',
            4: 'move'
        }
        data = {}
        for tank in state['myTank']:
            data[tank['id']] = actions.get(random.randint(0,4))
        print(data)
        return self.act(data)

    def close(self):
        url = self.uri + '/game/' + self.gameid + '/interrupt'
        requests.get(url)

if __name__=='__main__':
    client = Client('ml.niven.cn', '8777', 'SJDM10KAW')
    try:
        state = client.setup()
    except:
        client.close()
        print('game interrupt')

    for i in range(500):
        print('step:', i)
        state = client.sample(state)
        if state['ended']:
            print('game over')
            print('enemy tank count:', len(state['enemyTank']))
            print('my tank count:', len(state['myTank']))
            break

    print('steps out')
    client.close()

const request = require('request')
const H = require('hilbert')
const low = require('lowdb')

const actionList = {
  0: "stay",
  1: "left",
  2: "right",
  3: "move",
  4: "fire"
}

const directionList = {
  up: 0,
  left: 1,
  down: 2,
  right: 3
}

const directionArray = ['up','left','down','right']

function transformDirection(direction) {
  
}

function get(url) {
  return new Promise((resolve, reject) => {
    request.get(url,(error,res,body) => {
      if (!error) {
        resolve(body)
      }
    })
  })
}

function post(url, data) {
  return new Promise((resolve,reject) => {
    request.post({url, formData:data}, (error,res,body) => {
      if (!error) {
        resolve(body)
      }
    })
  })
}

let qlist = new Map()

const config = {
  learnRate: 0.5,
  learnCount: 0.2,
  gameid: 'rkCS9JsAb',
  gameside: 'red'
}

async function start() {
  let state = await get(`http://ml.niven.cn:8777/game/${config.gameid}/match/${config.gameside}`)
  let i = 0
  let reward = 0
  let currentEvent = ''
  let envStatus = {
    enemyTankPos: "",
    tankPos: "",
    bulletPos: "",
  }
  console.log(state)
  while (!state.ended) {
    currentEvent = state.events.map(item => item.type)
    console.log(i++, currentEvent)
    currentEvent.length == 0
      ? currentEvent.forEach(item => {
          switch (item) {
            case 'me-hit-enemy':
              reward += 60
            case 'enemy-hit-me':
              reward -= 100
            case 'me-hit-me':
              reward -= 100
            case 'collide-wall':
              reward -= 10
          }
        })
      : reward += 5
    const action = {}
    
    let tempBulletPos = null
    let tempBulletIndex = 0
    enemyTankPos.forEach((item,index) => {
      let distance = Math.sqrt(Math.pow(cur.x - myTank[0].x, 2) + Math.pow(cur.y - myTank[0].y, 2))
      if (tempBulletPos) {
        if (distance < 4 && distance < tempBulletPos) {
          tempBulletPos = distance
          tempBulletIndex = 0
        }
      } else {
        if (distance < 4) {
          tempBulletPos = distance
          tempBulletIndex = 0
        }
      }
    })

    envStatus.enemyTankPos = H.xyz2d(enemyTankPos[0].x, enemyTankPos[0].y, actionList[enemyTankPos[0].direction])
    envStatus.tankPos = H.xyz2d(myTank[0].x, myTank[0].y, actionList[myTank[0].direction])
    envStatus.bulletPos = H.xyz2d(enemyTankPos[tempBulletIndex].x, enemyTankPos[tempBulletIndex].y, actionList[enemyTankPos[tempBulletIndex].direction])

    let key = `${envStatus.enemyTankPos}-${envStatus.tankPos}-${envStatus.bulletPos}`

    let trendBenefit = Object.keys(actionList).map((item,index) => {
      return qlist.get()
    })

    state.myTank.forEach(tank => {
      action[tank.id] = actionList[Math.floor(Math.random() * 5)]
    })
    state = await post(`http://ml.niven.cn:8777/game/${config.gameid}/match/${config.gameside}`, JSON.stringify(action))
  }
}

start()
low('qtables').insert(qlist)
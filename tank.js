const request = require('request')
const H = require('hilbert')

const action = {
  left: "left",
  right: "right",
  move: "move",
  fire: "fire"
}

const status = {
  enemyTankPos: "enemy_tank_pos",
  enemyBulletPos: "enemy_bullet_pos",
  tankPos: "tank_pos",
  bulletPos: "bullet_pos",
  obstaclePos: "obstacle_pos"
}

let gameStatus = true

while (gameStatus) {

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

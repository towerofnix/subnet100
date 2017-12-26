let currentCoordinate, currentRoomNum

function track(num) {
  if (typeof num === 'string') {
    console.log('Track:', num)
  } else {
    console.log('Room:', num)
    currentRoomNum = num

    if (viewedLocations.findIndex(
      ([ coord, room ]) => coord === currentCoordinate && room === currentRoomNum
    ) === -1) {
      viewedLocations.push([currentCoordinate, currentRoomNum])
    }

    showMapForCurrentCoordinate()
  }
}

function track_loc(loc) {
  console.log('Location:', loc)
  currentCoordinate = loc.toString().padStart(3, '0')
  showMapForCurrentCoordinate()
}

const viewedLocations = [
/*['000', 1],
  ['000', 2],
  ['000', 3]*/
]

const loadImage = function(src) {
  return new Promise(resolve => {
    const image = new Image()
    image.addEventListener('load', () => {
      document.body.removeChild(image)
      resolve(image)
    })
    image.src = src
    image.style.display = 'none'
    document.body.appendChild(image)
  })
}

async function drawMapForCoordinate(coordinate) {
  console.log('draw', coordinate)
  const image = await loadImage(`images/${coordinate}.png`)
  console.log('got image')
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)

  const viewedInThisLoc = viewedLocations.filter(
    ([ coord, roomNum ]) => coord === coordinate
  ).map(([ coord, roomNum ]) => +roomNum)

  const notViewedInThisLoc = Object.entries(locations[coordinate]).filter(
    ([ roomNum, position ]) => !viewedInThisLoc.includes(+roomNum)
  )

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  for (const [ roomNum, [ row, col ] ] of notViewedInThisLoc) {
    ctx.fillRect(col * 300, row * 300, 300, 300)
  }

  return canvas
}

async function showMapForCurrentCoordinate() {
  const mapContainer = document.getElementById('map')
  while (mapContainer.hasChildNodes()) {
    mapContainer.removeChild(mapContainer.firstChild)
  }

  console.log(currentCoordinate)
  mapContainer.appendChild(await drawMapForCoordinate(currentCoordinate))
}

async function main() {
  await showMapForCurrentCoordinate()
}

main().catch(err => console.error(err))

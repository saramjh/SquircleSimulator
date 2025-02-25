document.addEventListener("DOMContentLoaded", () => {
	const squircle = document.getElementById("squircle")
	const sizeInput = document.getElementById("size")
	const sizeValue = document.getElementById("sizeValue")
	const colorInput = document.getElementById("color")
	const opacityInput = document.getElementById("opacity")
	const opacityValue = document.getElementById("opacityValue")
	const shadowInput = document.getElementById("shadow")
	const shadowValue = document.getElementById("shadowValue")
	const shadowAngleInput = document.getElementById("shadowAngle")
	const shadowAngleValue = document.getElementById("shadowAngleValue")
	const shadowDepthInput = document.getElementById("shadowDepth")
	const shadowDepthValue = document.getElementById("shadowDepthValue")
	const shadowOpacityInput = document.getElementById("shadowOpacity")
	const shadowOpacityValue = document.getElementById("shadowOpacityValue")
	const imageUpload = document.getElementById("imageUpload")
	const imageControls = document.getElementById("imageControls")
	const imageXInput = document.getElementById("imageX")
	const imageXValue = document.getElementById("imageXValue")
	const imageYInput = document.getElementById("imageY")
	const imageYValue = document.getElementById("imageYValue")
	const imageScaleInput = document.getElementById("imageScale")
	const imageScaleValue = document.getElementById("imageScaleValue")
	const thumbnailPreview = document.getElementById("thumbnailPreview")
	const resetButton = document.getElementById("resetButton")

	let imageElement = null
	let isDragging = false
	let startX, startY

	function updateSquircle() {
		const size = sizeInput.value
		const color = colorInput.value
		const opacity = opacityInput.value
		const shadow = shadowInput.value
		const shadowAngle = shadowAngleInput.value
		const shadowDepth = shadowDepthInput.value
		const shadowOpacity = shadowOpacityInput.value

		const shadowX = shadowDepth * Math.cos(shadowAngle * (Math.PI / 180))
		const shadowY = shadowDepth * Math.sin(shadowAngle * (Math.PI / 180))

		squircle.style.width = `${size}px`
		squircle.style.height = `${size}px`
		squircle.style.background = `linear-gradient(135deg, ${color}, ${shadeColor(color, 20)})`
		squircle.style.opacity = opacity
		squircle.style.boxShadow = `${shadowX}px ${shadowY}px ${shadow}px rgba(0, 0, 0, ${shadowOpacity})`

		sizeValue.value = size
		opacityValue.value = (opacity * 100).toFixed(0)
		shadowValue.value = shadow
		shadowAngleValue.value = shadowAngle
		shadowDepthValue.value = shadowDepth
		shadowOpacityValue.value = (shadowOpacity * 100).toFixed(0)

		if (imageElement) {
			applyImageTransformations(imageElement)
		}
	}

	function shadeColor(color, percent) {
		let R = parseInt(color.substring(1, 3), 16)
		let G = parseInt(color.substring(3, 5), 16)
		let B = parseInt(color.substring(5, 7), 16)

		R = parseInt((R * (100 + percent)) / 100)
		G = parseInt((G * (100 + percent)) / 100)
		B = parseInt((B * (100 + percent)) / 100)

		R = R < 255 ? R : 255
		G = G < 255 ? G : 255
		B = B < 255 ? B : 255

		const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16)
		const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16)
		const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16)

		return "#" + RR + GG + BB
	}

	function applyImageTransformations(image) {
		const imageX = imageXInput.value
		const imageY = imageYInput.value
		const imageScale = imageScaleInput.value / 100
		image.style.transform = `translate(-50%, -50%) scale(${imageScale}) translate(${imageX}px, ${imageY}px)`
		image.style.objectFit = "contain"
		imageXValue.value = imageX
		imageYValue.value = imageY
		imageScaleValue.value = imageScaleInput.value
	}

	function onDragStart(event) {
		if (!imageElement) {
			promptImageUpload()
			return
		}
		event.preventDefault()
		isDragging = true
		startX = event.clientX
		startY = event.clientY
	}

	function onDrag(event) {
		if (!isDragging || !imageElement) return
		event.preventDefault()

		const deltaX = event.clientX - startX
		const deltaY = event.clientY - startY

		const newX = parseInt(imageXInput.value) + deltaX
		const newY = parseInt(imageYInput.value) + deltaY

		// Restrict the image position within the grid area
		const maxX = squircle.clientWidth / 2
		const maxY = squircle.clientHeight / 2
		const minX = -maxX
		const minY = -maxY

		imageXInput.value = Math.max(minX, Math.min(maxX, newX))
		imageYInput.value = Math.max(minY, Math.min(maxY, newY))

		applyImageTransformations(imageElement)

		startX = event.clientX
		startY = event.clientY
	}

	function onDragEnd(event) {
		isDragging = false
	}

	function promptImageUpload() {
		imageUpload.click()
	}

	function handleImageUpload(event) {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				if (imageElement) {
					squircle.removeChild(imageElement)
				}
				imageElement = document.createElement("img")
				imageElement.src = e.target.result
				squircle.appendChild(imageElement)
				imageControls.style.display = "block"
				thumbnailPreview.innerHTML = `<img src="${e.target.result}" alt="Thumbnail">`
				imageXInput.value = 0
				imageYInput.value = 0
				applyImageTransformations(imageElement)
				updateSquircle()
			}
			reader.readAsDataURL(file)
		}
	}

	function onWheel(event) {
		if (!imageElement) return
		event.preventDefault()
		const scaleChange = event.deltaY < 0 ? 10 : -10
		imageScaleInput.value = Math.max(50, Math.min(200, parseInt(imageScaleInput.value) + scaleChange))
		imageScaleValue.value = imageScaleInput.value
		applyImageTransformations(imageElement)
	}

	squircle.addEventListener("mousedown", onDragStart)
	document.addEventListener("mousemove", onDrag)
	document.addEventListener("mouseup", onDragEnd)
	squircle.addEventListener("wheel", onWheel)

	sizeInput.addEventListener("input", () => {
		sizeValue.value = sizeInput.value
		updateSquircle()
	})
	sizeValue.addEventListener("input", () => {
		sizeInput.value = sizeValue.value
		updateSquircle()
	})

	colorInput.addEventListener("input", updateSquircle)

	opacityInput.addEventListener("input", () => {
		opacityValue.value = (opacityInput.value * 100).toFixed(0)
		updateSquircle()
	})
	opacityValue.addEventListener("input", () => {
		opacityInput.value = opacityValue.value / 100
		updateSquircle()
	})

	shadowInput.addEventListener("input", () => {
		shadowValue.value = shadowInput.value
		updateSquircle()
	})
	shadowValue.addEventListener("input", () => {
		shadowInput.value = shadowValue.value
		updateSquircle()
	})

	shadowAngleInput.addEventListener("input", () => {
		shadowAngleValue.value = shadowAngleInput.value
		updateSquircle()
	})
	shadowAngleValue.addEventListener("input", () => {
		shadowAngleInput.value = shadowAngleValue.value
		updateSquircle()
	})

	shadowDepthInput.addEventListener("input", () => {
		shadowDepthValue.value = shadowDepthInput.value
		updateSquircle()
	})
	shadowDepthValue.addEventListener("input", () => {
		shadowDepthInput.value = shadowDepthValue.value
		updateSquircle()
	})

	shadowOpacityInput.addEventListener("input", () => {
		shadowOpacityValue.value = (shadowOpacityInput.value * 100).toFixed(0)
		updateSquircle()
	})
	shadowOpacityValue.addEventListener("input", () => {
		shadowOpacityInput.value = shadowOpacityValue.value / 100
		updateSquircle()
	})

	thumbnailPreview.addEventListener("click", promptImageUpload)
	imageUpload.addEventListener("change", handleImageUpload)

	imageXInput.addEventListener("input", () => {
		imageXValue.value = imageXInput.value
		applyImageTransformations(imageElement)
	})
	imageXValue.addEventListener("input", () => {
		imageXInput.value = imageXValue.value
		applyImageTransformations(imageElement)
	})

	imageYInput.addEventListener("input", () => {
		imageYValue.value = imageYInput.value
		applyImageTransformations(imageElement)
	})
	imageYValue.addEventListener("input", () => {
		imageYInput.value = imageYValue.value
		applyImageTransformations(imageElement)
	})

	imageScaleInput.addEventListener("input", () => {
		imageScaleValue.value = imageScaleInput.value
		applyImageTransformations(imageElement)
	})
	imageScaleValue.addEventListener("input", () => {
		imageScaleInput.value = imageScaleValue.value
		applyImageTransformations(imageElement)
	})

	resetButton.addEventListener("click", () => {
		sizeInput.value = 150
		sizeValue.value = 150
		colorInput.value = "#939193"
		opacityInput.value = 1
		opacityValue.value = 100
		shadowInput.value = 10
		shadowValue.value = 10
		shadowAngleInput.value = 45
		shadowAngleValue.value = 45
		shadowDepthInput.value = 10
		shadowDepthValue.value = 10
		shadowOpacityInput.value = 0.5
		shadowOpacityValue.value = 50
		if (imageElement) {
			squircle.removeChild(imageElement)
			imageElement = null
			imageControls.style.display = "none"
			thumbnailPreview.innerHTML = "<span>Upload Image</span>"
			imageUpload.value = null // Clear the file input
		}
		updateSquircle()
	})

	updateSquircle()
})

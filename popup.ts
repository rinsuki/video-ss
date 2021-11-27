chrome.tabs.captureVisibleTab({format: "png"}, dataUrl => {
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
        const instantCanvas = document.createElement("canvas")
        instantCanvas.width = img.width
        instantCanvas.height = img.height
        const instantCtx = instantCanvas.getContext("2d")!
        instantCtx.drawImage(img, 0, 0)
        chrome.tabs.executeScript({
            code: `[window.devicePixelRatio, Array.from(document.getElementsByTagName("video")).map(v => JSON.parse(JSON.stringify(v.getBoundingClientRect())))]`
        }, ([[dpi, videos, ...others]]) => {
            console.log(dpi, videos, others)
            const imgsDiv = document.getElementById("imgs")!
            if (videos.length === 0) {
                imgsDiv.innerText = "videoタグあらへんがな"
            }
            videos.forEach((video: any) => {
                if (video.width === 0) return
                if (video.height === 0) return
                const canvas = document.createElement("canvas")
                canvas.width = video.width * dpi
                canvas.height = video.height * dpi
                const ctx = canvas.getContext("2d")!
                ctx.putImageData(instantCtx.getImageData(video.x * dpi, video.y * dpi, canvas.width, canvas.height), 0, 0)
                const img = new Image()
                img.src = canvas.toDataURL("image/png")
                img.width = 480
                imgsDiv.appendChild(img)
            })
        })
    }
})
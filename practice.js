// import * as BABYLON from "/Users/avina/node_modules/babylon/bin/babylon.js";
// import "/Users/avina/node_modules/babylonjs-loaders";

// Create the Babylon.js engine and canvas
const canvas = document.getElementById("renderCanvas"); // Add a <canvas> element with this ID in your HTML
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Light gray background

// Create the camera
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 500, new BABYLON.Vector3(0, 50, 0), scene);
camera.attachControl(canvas, true); // Enable mouse control

// Create lighting
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Add a directional light to simulate the sun
const directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
directionalLight.position = new BABYLON.Vector3(0, 300, 0);

// Load the 3D bus model
let bus;
BABYLON.SceneLoader.ImportMesh("", "./models/", "scene.gltf", scene, function (meshes) {
    bus = meshes[0]; // Assuming the bus is the first mesh
    bus.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2); // Scale down the bus
    bus.position = new BABYLON.Vector3(-900, 0, 0); // Start position of the bus
});

// Create the road
const roadMaterial = new BABYLON.StandardMaterial("roadMaterial", scene);
roadMaterial.diffuseTexture = new BABYLON.Texture("assets/road.jpg", scene);

const road = BABYLON.MeshBuilder.CreatePlane("road", { width: 2500, height: 250 }, scene);
road.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0); // Lay flat
road.material = roadMaterial;

// Define a path for the bus
const path = [
    new BABYLON.Vector3(-900, 0, 0),
    new BABYLON.Vector3(-500, 0, 50),
    new BABYLON.Vector3(0, 0, 100),
    new BABYLON.Vector3(500, 0, 50),
    new BABYLON.Vector3(900, 0, 0),
];

// Create an animation loop for the bus
let t = 0; // Parameter for animation progress (0 to 1)
scene.registerBeforeRender(() => {
    if (bus && t <= 1) {
        // Get the interpolated position on the path
        const currentPoint = BABYLON.Vector3.CatmullRom(path[0], path[1], path[2], path[3], t);

        // Update bus position and rotation
        bus.position = currentPoint;

        // Make the bus look at the next point on the path
        const nextPoint = BABYLON.Vector3.CatmullRom(path[0], path[1], path[2], path[3], t + 0.01);
        bus.lookAt(nextPoint);

        // Increment the animation parameter
        t += 0.001; // Adjust speed
    } else {
        t = 0; // Reset the path progress for looping
    }
});

// Start the engine's render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize the canvas when the window is resized
window.addEventListener("resize", () => {
    engine.resize();
});

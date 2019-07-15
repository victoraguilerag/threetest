import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';


function Home() {
  const [childCount] = useState(0);
  const [frameId, setFrameId] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [cube, setCube] = useState(null);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);
  const [init, setInit] = useState(false);
  const container = useRef(null);


  const renderScene = () => {
    renderer.render(scene, camera);
  };

  let direction = 'up';

  const animate = () => {
    if (cube.rotation.y > 1) {
      direction = 'down';
    } else if (cube.rotation.y < -1) {
      direction = 'up';
    }
    if (direction === 'up') {
      cube.rotation.y += 0.01;
      // cube.position.z += 0.05;
    } else if (direction === 'down') {
      cube.rotation.y -= 0.01;
      // cube.position.z -= 0.05;
    }

    renderScene();
    // frameId = window.requestAnimationFrame(animate)
    setFrameId(window.requestAnimationFrame(animate));
  };

  const start = () => {
    if (!frameId) {
      setFrameId(requestAnimationFrame(animate));
    }
  };
  // const stop = () => {
  //   cancelAnimationFrame(frameId);
  // };

  useEffect(() => {
    // const width = 600;
    // const height = 600;
    // ADD SCENE
    const newScene = new THREE.Scene();
    // ADD CAMERA
    const newCamera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const loader = new GLTFLoader();

    loader.load('static/phonetoweb.glb', (gltf) => {
      console.log(gltf);
      newCamera.position.z = 4;
      setCamera(newCamera);
      // ADD RENDERER
      const newRenderer = new THREE.WebGLRenderer({ antialias: true });
      newRenderer.setClearColor('#000000');
      newRenderer.setSize(window.innerWidth, window.innerHeight);
      setRenderer(newRenderer);
      container.current.appendChild(newRenderer.domElement);
      // ADD CUBE
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const texture = new THREE.TextureLoader().load('/static/daniela.jpg');
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const newCube = new THREE.Mesh(geometry, material);
      setCube(newCube);
      // newScene.add(newCube);
      newScene.add(gltf.scene);
      setScene(newScene);
      setInit(true);
    }, undefined, (error) => {
      console.error(error);
    });


  }, []);

  useEffect(() => {
    if (init) {
      start();
    }
  }, [init]);

  // const addChild = () => {
  //   const p = document.createElement('p');
  //   p.innerHTML = `new child ${childCount}`;
  //   container.current.appendChild(p);
  // };

  useEffect(() => {
    // addChild();
  }, [childCount]);

  return (
    <div className="home">
      <div className="container" ref={container} />
      <style jsx>
        {`
          :global(body) {
            margin: 0;
            overflow: hidden;
          }
          .home {
            width: auto;
            height: auto;
          }
          .container {
            width: 100vw;
            height: 100vh;
          }
          .container p {
            color: white;
          }
        `}
      </style>
    </div>
  );
}

export default Home;

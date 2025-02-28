particlesJS("particles-js", {
  particles: {
    number: {
      value: 70, //number of particles
      density: {
        enable: true,
        value_area: 600,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    size: {
      value: 3, 
    },
    move: {
      enable: true,
      speed: 5,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: true,
      },
    },
    line_linked: {
      enable: true, 
      distance: 150,
      opacity: 0.5,
      color: "#ffffff",
      width: 2,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_nb: 3,
      },
    },
  },
  retina_detect: true,
});


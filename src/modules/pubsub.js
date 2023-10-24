const createPubSub = () => {
  const tracker = {
    // key: eventName, value: [ funcs ]
  };

  return {
    subscribe(eventName, func) {
      if (tracker[eventName]) tracker[eventName].push(func);
      if (!tracker[eventName]) tracker[eventName] = [func];

      return {
        unsubscribe: () => {
          const funcs = tracker[eventName];
          const index = funcs.indexOf(func);
          if (index > -1) funcs.splice(index, 1);
        },
      };
    },

    publish(eventName, ...args) {
      const funcs = tracker[eventName];
      if (Array.isArray(funcs)) {
        funcs.forEach((func) => {
          func(...args);
        });
      }
    },
  };
};

const PubSub = createPubSub();

export default PubSub;

const storage = {
  save(name, data) {
    return localStorage.setItem(name, data);
  },
  load(name) {
    return localStorage.getItem(name);
  },
  remove(name) {
    return localStorage.removeItem(name);
  },
};

export default storage;

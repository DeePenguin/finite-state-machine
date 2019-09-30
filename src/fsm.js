class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) throw Error('config is required');
    this.config = config;
    this.active = config.initial;
    this.history = [this.active];
    this.historyPosition = 0;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.active;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.config.states[state]) {
      this.active = state;
      this.historyPosition ++;
      if (this.history[this.historyPosition]) this.history.splice(this.historyPosition);
      this.history.push(this.active);
    } 
    else throw Error('Unsupported state');
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    const nextState = this.config.states[this.active].transitions[event] 
    ? this.config.states[this.active].transitions[event] 
    : null;
    if (!nextState) throw Error('Wrong event');
    this.active = nextState;
    this.historyPosition ++;
    if (this.history[this.historyPosition]) this.history.splice(this.historyPosition);
    this.history.push(this.active);
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.active = this.config.initial;
    this.history.push(this.active);
    this.historyPosition ++;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event = null) {
    if (!event) return Object.keys(this.config.states);
    else {
      const states = [];
      Object.entries(this.config.states).map(([state, value]) => {
        if (value.transitions[event]) states.push(state);
      });
      return states;
    }
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (!this.history[this.historyPosition - 1]) return false;
    this.historyPosition --;
    this.active = this.history[this.historyPosition];
    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (!this.history[this.historyPosition + 1]) return false;
    this.historyPosition ++;
    this.active = this.history[this.historyPosition];
    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = [this.active];
    this.historyPosition = 0;
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

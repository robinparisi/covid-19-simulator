const DURATION = 10
const DEATH_RATE = 0.03
const POPULATION = 66524000
const DAYS = 180

class SIRModel {
  runSimulation () {
    this.days = []
    // inital situation
    const initialcases = 2000
    const initialrecoveries = 200
    const initialdeaths = 50

    this.days[0] = {
      healthy: this.population - initialcases - initialrecoveries - initialdeaths,
      cases: initialcases,
      recoveries: initialrecoveries,
      deaths: initialdeaths
    }

    for (let i = 1; i < DAYS + 1; i++) {
      const cases = this.getLastDay(i).cases + this.getLastDay(i).cases * this.dailyContactsRate * this.transmissionRisk * (this.getLastDay(i).healthy / this.population) - (1 / this.duration) * this.getLastDay(i).cases - (this.deathRate / this.duration) * this.getLastDay(i).cases
      const recoveries = this.getLastDay(i).recoveries + (1 / this.duration) * this.getLastDay(i).cases
      const deaths = this.getLastDay(i).deaths + (this.deathRate / this.duration) * this.getLastDay(i).cases

      this.days[i] = {
        healthy: this.population - cases - recoveries - deaths,
        cases: cases,
        recoveries: recoveries,
        deaths: deaths
      }

      // console.log(i, this.days[i])
    }
  }

  setParams (dailyContactsRate, transmissionRisk) {
    this.population = POPULATION
    this.dailyContactsRate = dailyContactsRate
    this.transmissionRisk = transmissionRisk
    this.duration = DURATION
    this.deathRate = DEATH_RATE
    this.r0 = this.dailyContactsRate * this.transmissionRisk * this.duration
  }

  getLastDay (day) {
    return this.days[day - 1]
  }

  getValues () {
    return this.days
  }
}

window.SIRModel = SIRModel

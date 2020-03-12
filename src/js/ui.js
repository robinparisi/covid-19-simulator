class UI {
  constructor (model) {
    this.model = model

    this.ui = {
      totalDeath: document.querySelector('#totalDeaths'),
      contactPerDay: document.querySelector('#contactPerDay'),
      probability: document.querySelector('#probability'),
      contactPerDayLabel: document.querySelector('[data-js-contactPerDayLabel]'),
      probabilityLabel: document.querySelector('[data-js-probabilityLabel]'),
      labelPopulation: document.querySelector('[data-label-population]'),
      labelDailyContactsRate: document.querySelector('[data-label-dailyContactsRate]'),
      labelTransmissionRisk: document.querySelector('[data-label-transmissionRisk]'),
      labelDuration: document.querySelector('[data-label-duration]'),
      labelDeathRate: document.querySelector('[data-label-deathRate]'),
      labelR0: document.querySelector('[data-label-r0]')
    }

    this.contactPerDay = 50
    this.transmissionRisk = 0.005
  }

  init () {
    this.bindEvents()
    this.runSimulation()
    this.refreshLabels()
    return this
  }

  bindEvents () {
    this.ui.contactPerDay.addEventListener('change', (e) => {
      this.onContactPerDayChange(this.ui.contactPerDay.value)
    })

    this.ui.probability.addEventListener('change', (e) => {
      this.onTransmissionRiskChange(this.ui.probability.value)
    })

    this.ui.contactPerDay.addEventListener('input', (e) => {
      this.refreshLabels()
    })

    this.ui.probability.addEventListener('input', (e) => {
      this.refreshLabels()
    })
  }

  onContactPerDayChange (val) {
    this.contactPerDay = val
    this.runSimulation()
  }

  onTransmissionRiskChange (val) {
    this.transmissionRisk = val / 100
    this.runSimulation()
  }

  runSimulation () {
    this.model.setParams(this.contactPerDay, this.transmissionRisk)
    this.model.runSimulation()
    const values = this.model.getValues()
    this.refreshDeaths(values[values.length - 1].deaths)
    this.refreshLabels()
    this.refreshGraph(values)
  }

  refreshLabels () {
    this.ui.contactPerDayLabel.innerHTML = this.ui.contactPerDay.value
    this.ui.probabilityLabel.innerHTML = this.ui.probability.value
    this.ui.labelPopulation.innerHTML = this.formatNumber(this.model.population)
    this.ui.labelDailyContactsRate.innerHTML = this.model.dailyContactsRate
    this.ui.labelTransmissionRisk.innerHTML = this.model.transmissionRisk * 100
    this.ui.labelDuration.innerHTML = this.model.duration
    this.ui.labelDeathRate.innerHTML = this.model.deathRate * 100
    this.ui.labelR0.innerHTML = (this.model.r0).toFixed(2)
  }

  refreshDeaths (deaths) {
    this.ui.totalDeath.innerHTML = this.formatNumber(deaths)
  }

  formatNumber (number) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  refreshGraph (values) {
    if (this.chart) {
      this.chart.destroy()
    }

    const ctx = document.getElementById('chart').getContext('2d')
    const dataset = {
      labels: [],
      healthy: [],
      cases: [],
      recoveries: [],
      deaths: []
    }

    values.forEach((item, index) => {
      if (index % 7 === 0) {
        dataset.labels.push(`week ${index / 7}`)
        dataset.healthy.push(Math.round(item.healthy))
        dataset.cases.push(Math.round(item.cases))
        dataset.recoveries.push(Math.round(item.recoveries))
        dataset.deaths.push(Math.round(item.deaths))
      }
    })

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataset.labels,
        datasets: [{
          label: 'Sains',
          data: dataset.healthy,
          borderColor: '#1a535c',
          fill: false,
          hidden: true
        },
        {
          label: 'Malades',
          data: dataset.cases,
          borderColor: '#ffe66d',
          fill: false
        },
        {
          label: 'Remis',
          data: dataset.recoveries,
          borderColor: '#4ecdc4',
          fill: false,
          hidden: true
        },
        {
          label: 'Morts',
          data: dataset.deaths,
          borderColor: '#ff6b6b',
          fill: false
        }]
      }
    })
  }
}

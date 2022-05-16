const Queue = require("./Queue");

class StarshipEnterprise {
  constructor(officerId = null, officerName = null, reportTo = null) {
    this.officerId = officerId;
    this.officerName = officerName;
    this.reportTo = reportTo; // the officer that the new officer reports to
    this.leftReport = null;
    this.rightReport = null;
  }

  assignOfficer(officerId, officerName) {
    // insert
    if (!this.officerId) {
      this.officerId = officerId;
      this.officerName = officerName;
    } else if (officerId < this.officerId) {
      if (!this.leftReport) {
        this.leftReport = new StarshipEnterprise(officerId, officerName);
      } else {
        this.leftReport.assignOfficer(officerId, officerName);
      }
    } else {
      if (!this.rightReport) {
        this.rightReport = new StarshipEnterprise(officerId, officerName);
      } else {
        this.rightReport.assignOfficer(officerId, officerName);
      }
    }
  }

  findOfficersWithNoDirectReports(values = []) {
    if (!this.rightReport && !this.leftReport && !this.reportTo) {
      values.push(this.officerName)
    }
    
    if (this.rightReport) {
      values = this.rightReport.findOfficersWithNoDirectReports(values);
    }

    if (this.leftReport) {
      values = this.leftReport.findOfficersWithNoDirectReports(values);
    }
    
    return values;
  }

  listOfficersByExperience(officerNames = []) {
    if (this.rightReport) {
      officerNames = this.rightReport.listOfficersByExperience(officerNames);
    }
    
    officerNames.push(this.officerName);

    if (this.leftReport) {
      officerNames = this.leftReport.listOfficersByExperience(officerNames);
    }
    
    return officerNames;
  }

  listOfficersByRank(tree, rankedOfficers = {}) {
    const queue = new Queue();
    queue.enqueue(tree);
    let officer = queue.dequeue();
    while (officer) {
      if (Object.keys(rankedOfficers).length == 0) {
         rankedOfficers[1] = [officer.officerName];
      } else {
        for (let [rank, arrayOfOfficers] of Object.entries(rankedOfficers)) {
          rank = parseInt(rank);
          if (arrayOfOfficers.includes(officer.reportTo)) {
            if(rankedOfficers[rank + 1]) {
              rankedOfficers[rank + 1].push(officer.officerName);
            } else {
              rankedOfficers[rank + 1] = [officer.officerName];
            }
          }
        }
      }

      if (officer.leftReport) {
        queue.enqueue(officer.leftReport);
      } 
      
      if (officer.rightReport) {
        queue.enqueue(officer.rightReport);
      }
            
      officer = queue.dequeue();
    }

    return rankedOfficers;
  }
}

module.exports = StarshipEnterprise;

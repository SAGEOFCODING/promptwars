const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onCrowdReportCreate = functions.firestore
    .document("crowd_reports/{reportId}")
    .onCreate((snap, context) => {
      const newValue = snap.data();
      console.log("New crowd report detected:", newValue);
      // Logic for push notifications or analytics aggregation
      return null;
    });

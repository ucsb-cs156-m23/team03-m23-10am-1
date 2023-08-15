const recommendationRequestFixtures = {
    oneRecommendationRequest:
    [
        {
            "id": 1,
            "requesterEmail" : "@student1",
            "professorEmail" : "@professor1",
            "explanation" : "explanation1",
            "dateRequested": "2022-01-03T00:00:00",
            "dateNeeded" : "2022-01-10T00:00:00",
            "done" : "true"
        }
    ],

    threeRecommendationRequests:
    [
        {
            "id": 2,
            "requesterEmail" : "@student2",
            "professorEmail" : "@professor2",
            "explanation" : "explanation2",
            "dateRequested": "2022-03-11T00:00:00",
            "dateNeeded" : "2022-03-18T00:00:00",
            "done" : "true"
        },

        {
            "id": 3,
            "requesterEmail" : "@student3",
            "professorEmail" : "@professor3",
            "explanation" : "explanation3",
            "dateRequested": "2022-04-21T00:00:00",
            "dateNeeded" : "2022-04-28T00:00:00",
            "done" : "false"
        },

        {
            "id": 4,
            "requesterEmail" : "@student4",
            "professorEmail" : "@professor4",
            "explanation" : "explanation4",
            "dateRequested": "2022-05-01T00:00:00",
            "dateNeeded" : "2022-05-08T00:00:00",
            "done" : "false"
        }
    ]
};

export { recommendationRequestFixtures };
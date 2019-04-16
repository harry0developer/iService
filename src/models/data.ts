import { User } from "./user";
import { ViewedJob, AppliedJob, SharedJob, Job } from "./job";
import { Appointment } from "./appointment";
import { RatingData, Rating } from "./rating";

export class UserData {
    users: User[];
    jobs: Job[];
    viewedJobs: ViewedJob[];
    appliedJobs: AppliedJob[];
    sharedJobs: SharedJob[];
    appointments: Appointment[];
    ratings: Rating[];

    constructor(userData?: any) {
        if (userData) {
            this.jobs = userData.jobs;
            this.users = userData.users;
            this.viewedJobs = userData.viewedJobs;
            this.appliedJobs = userData.appliedJobs;
            this.sharedJobs = userData.sharedJobs;
            this.appointments = userData.appointments;
            this.ratings = userData.ratings;
        }
    }

    setUsers(users: User[]) {
        this.users = users;
    }
    setJobs(jobs: Job[]) {
        this.jobs = jobs;
    }

    setViewedJobs(viewedJobs: ViewedJob[]) {
        this.viewedJobs = viewedJobs
    }
    setAppliedJob(appliedJobs: AppliedJob[]) {
        this.appliedJobs = appliedJobs;
    }
    setSharedJobs(sharedJobs: SharedJob[]) {
        this.sharedJobs = sharedJobs;
    }
    setAppointments(appointments: Appointment[]) {
        this.appointments = appointments;
    }
    setRatings(ratings: Rating[]) {
        this.ratings = ratings;
    }

}

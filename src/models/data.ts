import { User } from "./user";
import { ViewedJob, AppliedJob, SharedJob, Job } from "./job";
import { Appointment } from "./appointment";
import { RatingData } from "./rating";
import { Rating } from "ngx-rating";

export class UserData {
    profile: User;
    postedJobs: Job[];
    viewedJobs: ViewedJob[];
    appliedJobs: AppliedJob[];
    sharedJobs: SharedJob[];
    appointments: Appointment[];
    iRated: Rating[];
    ratedMe: Rating[];

    ratings: RatingData;
    constructor(userData?: any) {
        if (userData) {
            this.profile = userData.profile;
            this.postedJobs = userData.postedJobs;
            this.viewedJobs = userData.viewedJobs;
            this.appliedJobs = userData.appliedJobs;
            this.sharedJobs = userData.sharedJobs;
            this.appointments = userData.appointments;
            this.ratings = userData.ratings;
        }
    }

    setProfile(profile: User) {
        this.profile = profile
    }
    setPostedJobs(postedJobs: Job[]) {
        this.postedJobs = postedJobs
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
    setRatings(ratings: RatingData) {
        this.ratings = ratings;
    }

}

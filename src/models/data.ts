import { User } from "./user";
import { ViewedJob, AppliedJob, SharedJob, Job } from "./job";
import { Appointment } from "./appointment";
import { Rating } from "./rating";

export interface UserData {
    profile: User,
    postedJobs?: Job[],
    viewedJobs: ViewedJob[],
    appliedJobs: AppliedJob[],
    sharedJobs: SharedJob[],
    appointments: Appointment[],
    raters: Rating[],
}

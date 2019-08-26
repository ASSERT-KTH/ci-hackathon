# The Travis CI Documentation

The Travis websocket provides a stream of information for each Travis Job. This means that there can be several Travis jobs for one specific commit, i.e., there is one job for each configuration.
Moreover, the websocket also contain different events: “job”, “updated_job”, and “finished_job” it means that you can receive several time the same job from the API.

The possible states for one Travis job are:
- Created job: travis.yml has been parsed and the jobs are created
- Queued: the job wait an available slot to be executed
- Received: not sure about this one (wait that was allocate the ressources?)
- Started: the job execution started
- Passed: execution finished without exit > 0
- Failed: the script section of travis.yml failed
- Error: the install section of  travis.yml failed
- Canceled: the job is canceled before or during the execution

It is possible to identify unique build using with `build_id` and a unique job with `id`.

![job states](https://github.com/KTH/ci-hackathon/blob/master/site/img/travisci_state.png)

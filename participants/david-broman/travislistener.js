
const WebSocket = require('isomorphic-ws');

// Code from  https://travis.durieux.me/js/travisListener.js

function Job(data) {
    Object.assign(this, data);

    this.isFinished = function () {
        return this.state == "errored" || this.state == "canceled" || this.state == "failed" || this.state == "passed";
    }

    this.getLanguage = function () {
        return this.config.language;
    }

    this.getRepo = function () {
        if (this.repository_slug) {
            return this.repository_slug;
        } else {
            return null
        }
    }

    this.getOrganization = function () {
        if (this.repository_slug == null) {
            return null;
        }
        return this.repository_slug.split('/')[0];
    }

    this.getDuration = function () {
        if (this.started_at && this.finished_at) {
            return new Date(this.finished_at).getTime() - new Date(this.started_at).getTime();
        }
        return 0;
    }
}

function Build(data) {
    Object.assign(this, data);
    this.jobs = [];

    this.isFinished = function () {
        for (var job of this.jobs) {
            if (!job.isFinished()) {
                return false;
            }
        }
        return true;
    }

    this.getJob = function (jobId) {
        for (var job of this.jobs) {
            if (job.id === jobId) {
                return job;
            }
        }
        return null;
    }

    this.getRepo = function () {
        if (this.repository) {
            return this.repository.full_name;
        } else {
            return ''
        }
    }

    this.getOrganization = function () {
        if (this.repository) {
            return this.repository.full_name;
        } else {
            return ''
        }
    }
}

var travisListener = (function () {
    this.isAlive = false;

    var ws = null;

    var callbacks = {};

    var builds = {}

    this.connect = function (opt) {
        opt || (opt = {})
        opt.url || (opt.url = 'wss://travis.durieux.me');
        opt.autoReconnect || (opt.autoReconnect = true);
        var onmessage = function (e) {
            if (e.data[0] != '{') {
                return
            }
            var event = JSON.parse(e.data);
            var job = new Job(event.data)
            if (event.event.indexOf('build') > -1) {
                job = new Build(event.data)
            }
            dispatch(null, event.event, job);
            dispatch(event.event, event.event, job);
            dispatch(job.state, event.event, job);
            dispatch(job.repository_slug + '_' + event.event, event.event, job);
            dispatch(job.getOrganization() + '_' + event.event, event.event, job);

            if (builds[job.build_id] == null) {
                var build = new Build();
                build.id = job.build_id;
                build.commit = job.commit;
                build.repository_slug = job.repository_slug;

                build.jobs.push(job)
                builds[job.build_id] = build;
                dispatch('build', build);
                return
            }
            var build = builds[job.build_id];
            var previousJob = build.getJob(job.id);
            if (previousJob == null) {
                build.jobs.push(job)
                dispatch('build_updated', build);
            } else if (previousJob.state != job.state) {
                for (var index = 0; index < build.jobs.length; index++) {
                    if (build.jobs[index].id === job.id) {
                        build.jobs[index] = job;
                        dispatch('build_updated', build);
                        break;
                    }
                }
            }
            if (build.isFinished()) {
                dispatch('build_finished', build);
            }
        };
        function startWS(){
            ws = new WebSocket(opt.url);
            if (onmessage != null) {
                ws.onmessage = onmessage;
            }
            var that = this;
            ws.onopen = function(){
                that.isAlive = true;
            }
            if (opt.autoReconnect) {
                ws.onclose = function(){
                    that.isAlive = false;
                    // Try to reconnect in 5 seconds
                    setTimeout(function(){startWS()}, 5000);
                };
            }
        }
        startWS();
    }

    this.on = function () {
        var callback = arguments[arguments.length - 1];

        var eventName = [].slice.call(arguments, 0, arguments.length - 1).join('_')
        callbacks[eventName] = callbacks[eventName] || [];
        callbacks[eventName].push(callback);
        return this;
    }

    var dispatch = function(trigger, event, message){
        if (trigger == null) {
            trigger = ''
        }
        var chain = callbacks[trigger];
        if(typeof chain == 'undefined') return; // no callbacks for this event
        for(var i = 0; i < chain.length; i++){
            chain[i](message, event);
        }
    }
    return this;
})();

exports.travisListener = travisListener

Continuous integration
===

The programs that deliver our favorite online services continuously evolve. For all programs, a team of programmers constantly modifies some parts of the code to add cool features, to improve the interface or to make the service faster.  For example, 8790 changes have been applied on the [Chrome browser](https://www.openhub.net/p/chrome) in the last month. Each change is called a commit. Each commit can modify a few lines up to hundreds of lines of code. The 8790 commits have been contributed by 1004 different programmers.  

In order to make sure that all these changes do not contradict each others or do not completely break the service, it is important to regularly put the commits of different developers together and test the service. A
[Continuous  integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) engine is in charge of automatically collecting the commits, putting them together and testing the program. Each time the time the CI engine integrates one commit, it runs a [build](https://en.wikipedia.org/wiki/Software_build).

Travis CI
===

For this hackathon, we focus on one CI engine: [Travis CI](https://travis-ci.org/). We have selected it because it helps the developers of thousands of open source project to make sure that the changes they contribute are correct. Travis CI is literally the factory where the key components of the modern web and mobile applications are built. Here, we give a short introduction to Travis CI that is targeted for the hackathon. Interested readers can [learn much more about TravisCI](https://docs.travis-ci.com/user/for-beginners/)

Open source projects hosted on Github can register to Travis CI by inserting a `travis.yml` file in their repository. This file includes instructions for Travis to build the project when a commit is pushed on the repository. Then, every commit triggers a build. For every build,  Travis CI clones your GitHub repository into a brand-new virtual environment, and carries out a series of tasks to build and test your code. If one or more of those tasks fail, the build is considered broken. If none of the tasks fail, the build is considered passed and Travis CI can deploy your code to a web server or application host.





TravisCI stream for the ci-art hackathon
===

The hackathon participants have access, in real time, to every build that is performed in Travis. This represents an extraordinary intense activity that we wish to render through visual and sound pieces of [software art](https://en.wikipedia.org/wiki/Software_art). These pieces can render different aspects of the stream of software builds, extracting information for the commit messages, the programming language, the duration of builds or from the project that is built.

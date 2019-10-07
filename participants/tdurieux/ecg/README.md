# Travis ECG

Travis ECG is an electrocardiogram of the Travis.
Each pulse in the electrocardiogram represents a job that started to execute.
Each second we check if Travis-CI has started a job, if no build has been started in that second the electrocardiogram is flat.
If a job has started a pulse if triggered.

`Job Per Minute` shows the number of build that started in the last minute.
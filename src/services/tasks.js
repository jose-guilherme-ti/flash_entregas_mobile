import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const Tasks = {
    registerFetchTask: async function (FETCH_TASKNAME, runBackgroundSaga, INTERVAL) {
        TaskManager.defineTask(FETCH_TASKNAME, runBackgroundSaga);
    
        const status = await BackgroundFetch.getStatusAsync();
        switch (status) {
            case BackgroundFetch.Status.Restricted:
            case BackgroundFetch.Status.Denied:
                console.log("Background execution is disabled");
                return;
            default: {
                console.debug("Background execution allowed");
                let tasks = await TaskManager.getRegisteredTasksAsync();
                if (tasks.find(f => f.taskName === FETCH_TASKNAME) == null) {
                    console.log("Registering task");
                    await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, {
                        minimumInterval: INTERVAL,
                        stopOnTerminate: true,
                        startOnBoot: false
                      },).then(() => BackgroundFetch.setMinimumIntervalAsync(INTERVAL));
    
                    tasks = await TaskManager.getRegisteredTasksAsync();
                    console.debug("Registered tasks", tasks);
                } else {
                    console.log(`Task ${FETCH_TASKNAME} already registered, skipping`);
                    //await BackgroundFetch.unregisterTaskAsync(FETCH_TASKNAME); // clear task
                }
            }
        }
    },
    removeFetchTask: async function (FETCH_TASKNAME) {
        const status = await BackgroundFetch.getStatusAsync();
        switch (status) {
            case BackgroundFetch.Status.Restricted:
            case BackgroundFetch.Status.Denied:
                console.log("Background execution is disabled");
                return;
            default: {
                let tasks = await TaskManager.getRegisteredTasksAsync();
                if (tasks.find(f => f.taskName === FETCH_TASKNAME) == null) {
                    console.log("Task not found!");
                } else {
                    // clear task
                    await BackgroundFetch.unregisterTaskAsync(FETCH_TASKNAME);
                    console.log(`Task ${FETCH_TASKNAME} removed!`);
                }
            }
        }

    }
}
export default Tasks;
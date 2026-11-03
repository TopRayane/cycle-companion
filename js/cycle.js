PS D:\pj\lili-publisher\lili-publisher> $testData = "D:\pgdata\lili-publisher-test-5435"
>> $pg = "C:\Program Files\PostgreSQL\18\bin"
>> 
>> Write-Host "`n=== Restrict Test Cluster Directory ACL ===" -ForegroundColor Cyan
>> 
>> icacls $testData /inheritance:r
>> icacls $testData /grant:r "desktop-bqnuork\almasrayan:(OI)(CI)F"
>> icacls $testData /grant "NT AUTHORITY\SYSTEM:(OI)(CI)F"
>> icacls $testData /grant "BUILTIN\Administrators:(OI)(CI)F"
>> 
>> 
>> & "$pg\initdb.exe" `
>>     -D $testData `
>>     -U postgres `
>>     --encoding=UTF8 `
>>     --locale=C `
>>     --auth-local=scram-sha-256 `
>>     --auth-host=scram-sha-256 `
>>     -W

=== Restrict Test Cluster Directory ACL ===
processed file: D:\pgdata\lili-publisher-test-5435
Successfully processed 1 files; Failed processing 0 files
processed file: D:\pgdata\lili-publisher-test-5435
Successfully processed 1 files; Failed processing 0 files
processed file: D:\pgdata\lili-publisher-test-5435
Successfully processed 1 files; Failed processing 0 files
processed file: D:\pgdata\lili-publisher-test-5435
Successfully processed 1 files; Failed processing 0 files

=== Initialize Isolated PostgreSQL Cluster ===
The files belonging to this database system will be owned by user "AlmasRayan".
This user must also own the server process.

The database cluster will be initialized with locale "C".
The default text search configuration will be set to "english".

Data page checksums are enabled.

Enter new superuser password: 

Enter it again: 


fixing permissions on existing directory D:/pgdata/lili-publisher-test-5435 ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... windows
selecting default "max_connections" ... 100
selecting default "shared_buffers" ... 128MB
selecting default time zone ... America/Los_Angeles
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok

Success. You can now start the database server using:

    ^"C^:^\Program^ Files^\PostgreSQL^\18^\bin^\pg^_ctl^" -D ^"D^:^\pgdata^\lili^-publisher^-test^-5435^" -l logfile start

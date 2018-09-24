<html>
<head>

</head>
<body>
    <p>
        <ul>
        @foreach([$force] as $f)
            <li>{{ $f }}</li>
        @endforeach
        </ul>
    </p>
</body>
</html>
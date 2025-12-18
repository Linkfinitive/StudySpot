using System.Text.Json.Serialization;

namespace StudySpot.Backend;

//This is required so that the dotnet compiler and the WASM trimmer don't accidentally
//trim out the ability to serialize this type to JSON, which is required for interop.
[JsonSerializable(typeof(List<LocationDto>))]
public partial class AppJsonContext : JsonSerializerContext { }

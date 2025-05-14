using Ecommerce.Application.Commands.ViewHistory;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandlers.ViewHistory;
public class CleanupViewHistoryCommandHandler : IRequestHandler<CleanupViewHistoryCommand, bool>
{
    private readonly IUserViewHistoryRepository _userViewHistoryRepository;

    public CleanupViewHistoryCommandHandler(IUserViewHistoryRepository userViewHistoryRepository)
    {
        _userViewHistoryRepository = userViewHistoryRepository;
    }

    public async Task<bool> Handle(CleanupViewHistoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _userViewHistoryRepository.CleanOldViewsAsync(TimeSpan.FromDays(30));
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}